
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// import { CalendarIcon, Clock3Icon } from "lucide-react"
import { IconCalendar,IconClockDown  } from '@tabler/icons-react';
import { formatDate } from '@/lib/dateFormatting';

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    thumbnailUrl: string;
    duration: string;
    processingDate: string;
  }
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/processed/${video.id}`} className="block w-full max-w-sm">
      <Card className="overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg h-full">
        <div className="relative aspect-video">
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            layout="fill"
            objectFit="cover"
          />
          <Badge className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white">
            <IconClockDown  className="w-4 h-4 mr-1" />
            {video.duration}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h5 className="text-lg font-semibold line-clamp-2 mb-1">{video.title}</h5>
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <IconCalendar className="w-4 h-4 mr-1" />
            <span>Processed on: {formatDate(video.processingDate)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}