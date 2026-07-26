// src/components/media/ImageViewer.jsx
import React, { useRef } from 'react';

export default function ImageViewer({ src, onImageLoad }) {
  const imgRef = useRef(null);

  const handleLoad = () => {
    if (onImageLoad && imgRef.current) {
      onImageLoad({
        width: imgRef.current.naturalWidth,
        height: imgRef.current.naturalHeight,
        label: `${imgRef.current.naturalWidth} × ${imgRef.current.naturalHeight}`,
      });
    }
  };

  return (
    <div className="rounded-lg overflow-hidden border border-slate-800 bg-black aspect-video relative flex items-center justify-center">
      <img
        ref={imgRef}
        src={src}
        alt="Analysis target"
        onLoad={handleLoad}
        crossOrigin="anonymous"
        className="max-h-full max-w-full object-contain"
        style={{ maxHeight: '100%', maxWidth: '100%' }}
      />
    </div>
  );
}
