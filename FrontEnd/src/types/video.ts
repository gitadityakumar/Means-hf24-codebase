 export interface Video {
  _id: string;
  userId: string;
  url: string;
  channelAvatar: string;
  channelName: string;
  duration: string;
  lastUpdated: { $date: string };
  playtime: number;
  processed: boolean;
  thumbnailUrl: string;
  title: string;
}

export interface ApiResponse {
  videos?: Video[];
  message?: string;
  hasExtension?: boolean;
}