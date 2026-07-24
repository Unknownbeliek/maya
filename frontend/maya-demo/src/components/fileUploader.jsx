// src/components/FileUploader.jsx
import React, { useRef } from 'react';

export const FileUploader = ({ onFileSelect }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-900/40 hover:bg-slate-900/80 p-6 rounded-xl text-center cursor-pointer transition-all group"
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
            />
            <div className="text-slate-400 group-hover:text-emerald-400 font-mono text-xs mb-1">
                📁 Drag & Drop Video File or <span className="underline">Browse Local Disk</span>
            </div>
            <p className="text-[10px] text-slate-500">Supports MP4, WEBM (Client-Side WASM Processing)</p>
        </div>
    );
};