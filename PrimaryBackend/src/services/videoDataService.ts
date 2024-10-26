import { VideoData } from '../types/videoData';

const videoDataMap = new Map<string, VideoData & { lastUpdated: Date }>();

function isValidVideoData(data: any): data is VideoData {
  return (
    typeof data === 'object' &&
    typeof data.url === 'string' &&
    typeof data.thumbnailUrl === 'string' &&
    typeof data.channelAvatar === 'string' &&
    typeof data.title === 'string' &&
    typeof data.channelName === 'string' &&
    typeof data.duration === 'string' &&
    typeof data.playtime === 'number' &&
    data.playtime >= 0
  );
}

export function processVideoData(data: any) {
  if (!isValidVideoData(data)) {
    console.error('Invalid video data received:', data);
    return;
  }

  const existingData = videoDataMap.get(data.url);
  if (!existingData || data.playtime > existingData.playtime) {
    videoDataMap.set(data.url, { ...data, lastUpdated: new Date() });
    console.log('Processed video data:', { ...data, lastUpdated: new Date() });
  }
}

export function getProcessedVideoData(): (VideoData & { lastUpdated: Date })[] {
  return Array.from(videoDataMap.values());
}

export function clearVideoDataMap() {
  videoDataMap.clear();
}