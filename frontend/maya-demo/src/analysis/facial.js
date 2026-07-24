// src/analysis/facial.js

// Calculate the euclidean distance between two points
const euclideanDist = (p1, p2) => {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2 + (p1.z - p2.z) ** 2);
};

// Calculate the Eye Aspect Ratio (EAR) given the eye landmarks
export const getEAR = (landmarks) => {
  // Vertical distances
  const v1 = euclideanDist(landmarks[1], landmarks[5]); // top to bottom
  const v2 = euclideanDist(landmarks[2], landmarks[4]); // top-inner to bottom-inner
  
  // Horizontal distance
  const h = euclideanDist(landmarks[0], landmarks[3]); // left to right corner
  
  // Eye Aspect Ratio
  const ear = (v1 + v2) / (2.0 * h);
  return ear;
};

// Define the landmark indices for the left and right eyes
// See MediaPipe docs for landmark map: https://developers.google.com/mediapipe/solutions/vision/face_landmarker
export const EYE_LANDMARKS = {
  left: [
    { name: "L_H_Corner", index: 33 },
    { name: "L_V_Top", index: 159 },
    { name: "L_V_Top_Inner", index: 158 },
    { name: "L_H_Inner", index: 133 },
    { name: "L_V_Bot_Inner", index: 144 },
    { name: "L_V_Bot", index: 145 },
  ],
  right: [
    { name: "R_H_Corner", index: 263 },
    { name: "R_V_Top", index: 386 },
    { name: "R_V_Top_Inner", index: 385 },
    { name: "R_H_Inner", index: 362 },
    { name: "R_V_Bot_Inner", index: 373 },
    { name: "R_V_Bot", index: 374 },
  ],
};

// Define landmark indices for mouth / lips analysis
export const LIP_LANDMARKS = {
  topCenter: 13,
  bottomCenter: 14,
  topLeft: 82,
  bottomLeft: 87,
  topRight: 312,
  bottomRight: 317,
  leftCorner: 61,
  rightCorner: 291,
};

// Calculate Mouth Aspect Ratio (MAR) to measure lip distance / opening
export const getMAR = (landmarks) => {
  if (!landmarks || landmarks.length < 318) return 0;
  
  const pTopCenter = landmarks[LIP_LANDMARKS.topCenter];
  const pBottomCenter = landmarks[LIP_LANDMARKS.bottomCenter];
  const pTopLeft = landmarks[LIP_LANDMARKS.topLeft];
  const pBottomLeft = landmarks[LIP_LANDMARKS.bottomLeft];
  const pTopRight = landmarks[LIP_LANDMARKS.topRight];
  const pBottomRight = landmarks[LIP_LANDMARKS.bottomRight];
  const pLeftCorner = landmarks[LIP_LANDMARKS.leftCorner];
  const pRightCorner = landmarks[LIP_LANDMARKS.rightCorner];

  if (!pTopCenter || !pBottomCenter || !pLeftCorner || !pRightCorner) return 0;

  const v1 = euclideanDist(pTopCenter, pBottomCenter);
  const v2 = euclideanDist(pTopLeft, pBottomLeft);
  const v3 = euclideanDist(pTopRight, pBottomRight);
  const h = euclideanDist(pLeftCorner, pRightCorner);

  if (h === 0) return 0;
  return (v1 + v2 + v3) / (3.0 * h);
};

