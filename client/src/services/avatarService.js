/**
 * Service to interface with Photorealistic Talking Avatar APIs (e.g. D-ID, HeyGen)
 * All frontend requests route through the backend proxy to prevent API key exposure.
 */

// Placeholder video loops for development
const IDLE_VIDEO_URL = 'https://res.cloudinary.com/bpv3iunv/video/upload/v1782903562/yatnesh_idle.mp4';
const DEFAULT_TALK_VIDEO_URL = 'https://res.cloudinary.com/bpv3iunv/video/upload/v1782903562/yatnesh_talk.mp4';

export const getIdleVideoUrl = () => {
  return IDLE_VIDEO_URL;
};

/**
 * Triggers backend speaking video generation or streams response text.
 * @param {string} text - The response text to speak.
 * @returns {Promise<string>} - Returns the URL of the synthesized MP4 or stream endpoint.
 */
export const generateSpeakingVideo = async (text) => {
  try {
    const response = await fetch('/api/avatar/speak', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    if (data.success && data.videoUrl) {
      return data.videoUrl;
    }
    throw new Error(data.message || 'Failed to generate speaking video');
  } catch (err) {
    console.warn('generateSpeakingVideo fallback to local default video:', err.message);
    // Graceful fallback to default demo speaking clip
    return DEFAULT_TALK_VIDEO_URL;
  }
};
