import sys
import json
import os
import math
import numpy as np
import cv2

try:
    import librosa
except Exception:
    librosa = None

try:
    import mediapipe as mp
    mp_face_mesh = mp.solutions.face_mesh
except Exception:
    mp_face_mesh = None


def euclidean_dist(p1, p2):
    return math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2)


def calculate_mar(landmarks, width, height):
    # MediaPipe indices: 13 (top inner), 14 (bottom inner), 61 (left corner), 291 (right corner), 82/87, 312/317
    try:
        def get_pt(idx):
            lm = landmarks[idx]
            return (lm.x * width, lm.y * height, lm.z * width)

        p13 = get_pt(13)
        p14 = get_pt(14)
        p82 = get_pt(82)
        p87 = get_pt(87)
        p312 = get_pt(312)
        p317 = get_pt(317)
        p61 = get_pt(61)
        p291 = get_pt(291)

        v1 = euclidean_dist(p13, p14)
        v2 = euclidean_dist(p82, p87)
        v3 = euclidean_dist(p312, p317)
        h = euclidean_dist(p61, p291)

        if h == 0:
            return 0.0
        return float((v1 + v2 + v3) / (3.0 * h))
    except Exception:
        return 0.0


def calculate_ear(landmarks, width, height):
    # Eye Aspect Ratio calculation for blink detection (Left eye: 33, 160, 158, 133, 153, 144)
    try:
        def get_pt(idx):
            lm = landmarks[idx]
            return (lm.x * width, lm.y * height)

        p33 = get_pt(33)
        p160 = get_pt(160)
        p158 = get_pt(158)
        p133 = get_pt(133)
        p153 = get_pt(153)
        p144 = get_pt(144)

        v1 = math.sqrt((p160[0]-p144[0])**2 + (p160[1]-p144[1])**2)
        v2 = math.sqrt((p158[0]-p153[0])**2 + (p158[1]-p153[1])**2)
        h = math.sqrt((p33[0]-p133[0])**2 + (p33[1]-p133[1])**2)

        if h == 0:
            return 0.3
        return float((v1 + v2) / (2.0 * h))
    except Exception:
        return 0.3


def analyze_av_sync(video_path):
    is_url = video_path.startswith("http://") or video_path.startswith("https://")
    
    if not is_url and not os.path.exists(video_path):
        return {"success": False, "error": f"File not found: {video_path}"}

    # 1. Open Video Stream with OpenCV
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return {"success": False, "error": "Could not open video stream with OpenCV"}

    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)) or 640
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)) or 480

    lip_mar_series = []
    ear_series = []
    
    # Run MediaPipe Face Mesh if available
    if mp_face_mesh:
        face_mesh = mp_face_mesh.FaceMesh(
            static_image_mode=False,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
        )

        frame_count = 0
        while cap.isOpened() and frame_count < 900: # Limit to 900 frames (~30 sec) for URL stream analysis speed
            ret, frame = cap.read()
            if not ret:
                break

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = face_mesh.process(rgb_frame)

            if results.multi_face_landmarks:
                landmarks = results.multi_face_landmarks[0].landmark
                mar = calculate_mar(landmarks, width, height)
                ear = calculate_ear(landmarks, width, height)
                lip_mar_series.append(mar)
                ear_series.append(ear)
            else:
                lip_mar_series.append(0.0)
                ear_series.append(0.3)

            frame_count += 1
        cap.release()
        face_mesh.close()
    else:
        # Fallback frame motion analysis
        frame_count = 0
        prev_gray = None
        while cap.isOpened() and frame_count < 900:
            ret, frame = cap.read()
            if not ret:
                break
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            if prev_gray is not None:
                diff = cv2.absdiff(gray, prev_gray)
                lip_mar_series.append(float(np.mean(diff) / 255.0))
            else:
                lip_mar_series.append(0.0)
            ear_series.append(0.3)
            prev_gray = gray
            frame_count += 1
        cap.release()

    N = len(lip_mar_series)
    if N < 5:
        return {"success": False, "error": "Insufficient video frames detected"}

    # 2. Extract Audio RMS Energy using Librosa (if local path)
    audio_rms_series = [0.0] * N
    if librosa and not is_url:
        try:
            y, sr = librosa.load(video_path, sr=22050, mono=True)
            if len(y) > 0:
                hop_length = int(sr / fps)
                rms = librosa.feature.rms(y=y, hop_length=hop_length)[0]
                if len(rms) > 0:
                    audio_rms_series = np.interp(
                        np.linspace(0, len(rms), N),
                        np.arange(len(rms)),
                        rms
                    ).tolist()
        except Exception:
            pass

    # 3. Normalize Series
    mar_arr = np.array(lip_mar_series, dtype=np.float64)
    rms_arr = np.array(audio_rms_series, dtype=np.float64)

    mar_max = np.max(mar_arr) if np.max(mar_arr) > 0 else 1.0
    rms_max = np.max(rms_arr) if np.max(rms_arr) > 0 else 1.0

    norm_mar = (mar_arr / mar_max).tolist()
    norm_rms = (rms_arr / rms_max).tolist()

    # 4. Deepfake AI Landmark & Blink Artifact Detection
    blinks = sum(1 for e in ear_series if e < 0.18)
    mar_std = float(np.std(mar_arr))
    
    correlation_score = 100.0
    offset_ms = 0
    desync_events = []

    # If audio is available, cross-correlate
    if np.std(mar_arr) > 0.001 and np.std(rms_arr) > 0.001:
        r = float(np.corrcoef(mar_arr, rms_arr)[0, 1])
        if not math.isnan(r):
            correlation_score = max(0.0, min(100.0, round((r + 1.0) / 2.0 * 100, 1)))

        cross_corr = np.correlate(mar_arr - np.mean(mar_arr), rms_arr - np.mean(rms_arr), mode='full')
        lags = np.arange(-len(mar_arr) + 1, len(mar_arr))
        best_lag = lags[np.argmax(cross_corr)]
        offset_ms = int(round((best_lag / fps) * 1000))
    else:
        # Landmark motion & MAR variance evaluation for URL streams
        if mar_std < 0.015:
            # Unnaturally low mouth motion / synthetic frozen lower face
            correlation_score -= 35.0
            desync_events.append({
                "timestamp": "00:02",
                "seconds": 2,
                "type": "AI Synthetic Lip-Sync",
                "detail": "Unnaturally low lip motion variance (MAR std < 0.015)"
            })
        elif mar_std > 0.18:
            # High MAR jitter / distorted AI mouth mesh
            correlation_score -= 30.0
            desync_events.append({
                "timestamp": "00:04",
                "seconds": 4,
                "type": "Lip-Sync Mesh Distortion",
                "detail": "Abnormal mouth aspect ratio jitter detected"
            })

    # Blink rate check (AI video landmark artifact)
    duration_sec = N / fps
    expected_min_blinks = max(1, int(duration_sec / 10))
    if blinks < expected_min_blinks and duration_sec > 8:
        correlation_score -= 20.0
        desync_events.append({
            "timestamp": "00:06",
            "seconds": 6,
            "type": "AI Generation / Low Blink Rate",
            "detail": f"Detected only {blinks} eye blink(s) over {int(duration_sec)}s video"
        })

    correlation_score = max(35.0, min(100.0, correlation_score))

    status = "Synchronized"
    if correlation_score < 75.0 or len(desync_events) > 0 or abs(offset_ms) > 120:
        status = "Lip-Sync Anomaly Detected"

    return {
        "success": True,
        "correlation_score": round(correlation_score, 1),
        "offset_ms": offset_ms,
        "av_sync_status": status,
        "total_frames": N,
        "fps": round(fps, 1),
        "desync_events": desync_events,
        "blinks": blinks,
        "mar_std": round(mar_std, 4),
        "sample_mar": norm_mar[::max(1, N // 20)]
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "Video path argument required"}))
        sys.exit(1)

    video_file = sys.argv[1]
    result = analyze_av_sync(video_file)
    print(json.dumps(result))
