// src/analysis/metadata.js
import ExifReader from 'exifreader';

export const extractFileMetadata = async (file) => {
  try {
    const tags = await ExifReader.load(file);
    return {
      software: tags['Software']?.description || 'Unknown / Stripped',
      make: tags['Make']?.description || 'Standard Web Clip',
      hasExif: !!tags['Software'] || !!tags['Make']
    };
  } catch (e) {
    return { software: 'No EXIF Header Found (Stripped)', make: 'Web Stream', hasExif: false };
  }
};
