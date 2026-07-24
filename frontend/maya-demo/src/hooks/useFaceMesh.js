import { useEffect } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export const useFaceMesh = (videoRef, canvasRef) => {
  useEffect(() => {
    let faceLandmarker;
    let animationFrameId;

    const initLandmarker = async () => {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );
      
      faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numFaces: 1
      });

      renderLoop();
    };

    const renderLoop = () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState >= 2) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const results = faceLandmarker?.detectForVideo(video, performance.now());
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (results?.faceLandmarks?.[0]) {
          ctx.fillStyle = '#10B981'; // Emerald tracking dots
          for (const landmark of results.faceLandmarks[0]) {
            const x = landmark.x * canvas.width;
            const y = landmark.y * canvas.height;
            ctx.fillRect(x, y, 2, 2);
          }
        }
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    initLandmarker();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [videoRef, canvasRef]);
};