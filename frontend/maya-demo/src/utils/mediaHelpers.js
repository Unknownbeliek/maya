// src/utils/mediaHelpers.js

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'bmp', 'tiff', 'svg'];
const AUDIO_EXTS = ['mp3', 'wav', 'aac', 'm4a', 'flac', 'ogg', 'opus', 'wma'];
const VIDEO_EXTS = ['mp4', 'webm', 'mov', 'mkv', 'avi', 'ts', 'm4v', '3gp'];

function getExtension(name) {
  return (name || '').split('.').pop().toLowerCase();
}

export function isYouTubeUrl(url) {
  if (!url) return false;
  return /youtube\.com\/watch|youtu\.be\/|youtube\.com\/shorts/.test(url);
}

export function extractYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/shorts\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function classifyMediaType(file, url) {
  // Check for YouTube first
  if (url && isYouTubeUrl(url)) return 'youtube';

  // File-based classification
  if (file) {
    const mime = (file.type || '').toLowerCase();
    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('audio/')) return 'audio';
    if (mime.startsWith('video/')) return 'video';
    const ext = getExtension(file.name);
    if (IMAGE_EXTS.includes(ext)) return 'image';
    if (AUDIO_EXTS.includes(ext)) return 'audio';
    if (VIDEO_EXTS.includes(ext)) return 'video';
  }

  // URL-based classification
  if (url) {
    const cleanUrl = url.split('?')[0].toLowerCase();
    const ext = getExtension(cleanUrl);
    if (IMAGE_EXTS.includes(ext)) return 'image';
    if (AUDIO_EXTS.includes(ext)) return 'audio';
    if (VIDEO_EXTS.includes(ext)) return 'video';
  }

  return 'video'; // default
}

export function getFormatLabel(file, url, type) {
  if (file) {
    const ext = getExtension(file.name).toUpperCase();
    return ext || (type || 'VIDEO').toUpperCase();
  }
  if (url) {
    const ext = getExtension(url.split('?')[0]).toUpperCase();
    return ext && ext.length <= 5 ? ext : (type || 'VIDEO').toUpperCase();
  }
  return (type || 'VIDEO').toUpperCase();
}
