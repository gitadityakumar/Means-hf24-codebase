import { Video } from '@/types/processedVideoTypes';
import { formatMonthYear } from '@/lib/dateFormatting';
import { fetchProcessedVideos } from '@/app/actions/fetchProcessedVideos';


export async function getVideoDetails(id: string): Promise<Video | null> {
  const videos = await fetchProcessedVideos();
  return videos.find(video => video.id === id) || null;
}

export function groupVideosByMonth(videos: Video[]): Record<string, Video[]> {
  return videos.reduce((acc, video) => {
    const monthYear = formatMonthYear(video.processingDate);

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(video);

    return acc;
  }, {} as Record<string, Video[]>);
}
