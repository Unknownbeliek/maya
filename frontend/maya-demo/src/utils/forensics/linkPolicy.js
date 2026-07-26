const YOUTUBE_HOSTS = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'www.youtu.be'];

export function validateMediaUrl(url) {
  if (!url) {
    return { isValid: false, reason: 'No URL provided.' };
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return { isValid: false, reason: 'Invalid URL format.' };
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return { isValid: false, reason: 'Only http and https links are supported.' };
  }

  const isYouTube = YOUTUBE_HOSTS.includes(parsed.hostname);
  const isDirectMedia = /\.(mp4|webm|mov|m4v|m3u8|mp3|wav|aac|m4a|flac|ogg|jpg|jpeg|png|webp|avif)(\?.*)?$/i.test(parsed.pathname + parsed.search);

  if (!isYouTube && !isDirectMedia) {
    return { isValid: false, reason: 'Platform security policies prevent direct stream extraction for this link.' };
  }

  return { isValid: true, reason: '', isYouTube, isDirectMedia };
}

export function getFallbackMessage() {
  return 'Direct Media Stream Restricted. Platform security policies prevent direct stream extraction. Please download the file to your device and drag-and-drop it here for zero-cloud local verification.';
}
