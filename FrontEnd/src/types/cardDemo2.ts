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


export interface CardDemoProps {
  video: Video;
  onSelect: (id: string) => void;
   isSelected: boolean;
}
