const AUDIO_ONLY_MIME_PREFIXES = ['audio/'];
const VIDEO_MIME_PREFIXES = ['video/'];

const AUDIO_EXTENSIONS = ['mp3', 'wav', 'aac', 'm4a', 'flac', 'ogg', 'opus'];
const VIDEO_EXTENSIONS = ['mp4', 'mov', 'webm', 'mkv', 'm4v', 'avi'];
const STYLIZED_CUES = [
  'anime', 'manga', 'cartoon', 'animated', 'animation', '2d', 'cel', 'toon',
  'chibi', 'pixel art', 'illustration', 'stylized', 'line art', 'line-art',
  'cell shaded', 'cel shaded', 'painted frame', 'sketch', 'comic'
];

const MEDIA_CLASSIFICATIONS = {
  PHOTOREALISTIC_VIDEO: 'PHOTOREALISTIC_VIDEO',
  STYLIZED_ANIME_CARTOON: 'STYLIZED_ANIME_CARTOON',
  STANDALONE_AUDIO: 'STANDALONE_AUDIO',
};

const normalizeText = (value) => String(value || '').toLowerCase();

const getExtension = (name = '') => {
  const match = String(name).toLowerCase().match(/\.([a-z0-9]+)$/);
  return match ? match[1] : '';
};

const matchesCue = (text, cue) => text.includes(cue);

export function classifyMediaInput({
  file = null,
  url = '',
  title = '',
  description = '',
  mediaType = '',
  duration = 0,
  hasAudioTrack = null,
  hasVideoTrack = null,
} = {}) {
  const fileName = file?.name || '';
  const fileType = normalizeText(file?.type);
  const sourceText = [fileName, fileType, url, title, description, mediaType].join(' ').toLowerCase();
  const extension = getExtension(fileName || url);

  const isAudioOnly = (
    AUDIO_ONLY_MIME_PREFIXES.some(prefix => fileType.startsWith(prefix)) ||
    AUDIO_EXTENSIONS.includes(extension) ||
    mediaType === 'audio' ||
    hasVideoTrack === false
  );

  const stylizedHits = STYLIZED_CUES.filter(cue => matchesCue(sourceText, cue));
  const looksStylized = stylizedHits.length > 0;

  const isVideoSource = (
    VIDEO_MIME_PREFIXES.some(prefix => fileType.startsWith(prefix)) ||
    VIDEO_EXTENSIONS.includes(extension) ||
    mediaType === 'video' ||
    hasVideoTrack === true
  );

  let mediaClass = MEDIA_CLASSIFICATIONS.PHOTOREALISTIC_VIDEO;
  if (isAudioOnly) {
    mediaClass = MEDIA_CLASSIFICATIONS.STANDALONE_AUDIO;
  } else if (looksStylized && isVideoSource) {
    mediaClass = MEDIA_CLASSIFICATIONS.STYLIZED_ANIME_CARTOON;
  }

  const displayLabels = {
    [MEDIA_CLASSIFICATIONS.PHOTOREALISTIC_VIDEO]: 'Photorealistic Video',
    [MEDIA_CLASSIFICATIONS.STYLIZED_ANIME_CARTOON]: '2D Animated Content',
    [MEDIA_CLASSIFICATIONS.STANDALONE_AUDIO]: 'Standalone Audio',
  };

  const analysisPillars = mediaClass === MEDIA_CLASSIFICATIONS.STANDALONE_AUDIO
    ? ['Acoustic vocoder analysis', 'Noise floor shift detection']
    : mediaClass === MEDIA_CLASSIFICATIONS.STYLIZED_ANIME_CARTOON
      ? ['Temporal line-art continuity', 'Color palette edge consistency']
      : ['MediaPipe 468 mesh', 'Audio kinematics'];

  return {
    mediaClass,
    displayLabel: displayLabels[mediaClass],
    analysisPillars,
    shouldUseVision: mediaClass !== MEDIA_CLASSIFICATIONS.STANDALONE_AUDIO,
    shouldUseFaceMesh: mediaClass === MEDIA_CLASSIFICATIONS.PHOTOREALISTIC_VIDEO,
    shouldUseAudioKinematics: true,
    isStylized: mediaClass === MEDIA_CLASSIFICATIONS.STYLIZED_ANIME_CARTOON,
    isAudioOnly,
    confidence: mediaClass === MEDIA_CLASSIFICATIONS.STYLIZED_ANIME_CARTOON ? 88 : mediaClass === MEDIA_CLASSIFICATIONS.STANDALONE_AUDIO ? 96 : 82,
    cues: stylizedHits,
    duration,
  };
}

export { MEDIA_CLASSIFICATIONS };
