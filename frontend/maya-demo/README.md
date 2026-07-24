# Maya - Deepfake & Digital Media Authenticity Verification

Maya is a tool designed to detect manipulated or AI-generated multimedia. As generative AI advances, it becomes increasingly challenging to distinguish authentic digital media from manipulated content. This project aims to provide a set of tools to analyze and verify the authenticity of images and videos.

## Problem Statement

The rapid advancement of generative AI has made it increasingly challenging to distinguish
authentic digital media from manipulated content. Deepfake videos, AI-generated voices,
and synthetic images pose significant risks to journalism, public safety, elections,
businesses, and digital trust.

This project aims to develop a solution capable of detecting manipulated or AI-generated multimedia by
leveraging AI/ML models, digital forensics, metadata analysis, and content verification
techniques. The platform should verify images and videos, provide a confidence score, and
help users check whether the content is real or AI-generated before or after sharing it online.

## Features

- **Facial Anomaly Detection:** Utilizes MediaPipe's FaceLandmarker to detect facial anomalies in real-time, such as:
  - Low blink rate
  - Rigid head pose
  - Face disappearing from the frame
- **File Metadata Analysis:** Extracts and displays EXIF metadata from files to identify the software used to create or modify the media.
- **File Hashing:** Calculates the SHA256 hash of the uploaded file for integrity verification.
- **Audio Kinematics Analysis:** (Future) Analyze audio for signs of manipulation.

## Tech Stack

- **Frontend:**
  - React
  - Vite
  - TailwindCSS
- **Analysis:**
  - MediaPipe Tasks Vision (`@mediapipe/tasks-vision`)
  - ExifReader.js
- **Backend:** (Future)
  - Node.js
  - Express

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the frontend directory:**
    ```bash
    cd maya/frontend/maya-demo
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
5.  Open your browser and navigate to `http://localhost:5173` (or the address shown in your terminal).

## Folder Structure

The `src` folder is organized as follows:

- `src/analysis`: Contains modules for performing various analyses (facial, hashing, metadata).
- `src/assets`: Static assets like images and fonts.
- `src/components`: Reusable React components.
- `src/hooks`: Custom React hooks, like `useFaceMesh` for MediaPipe integration.
- `src/`: Root contains the main application entry point and global styles.
