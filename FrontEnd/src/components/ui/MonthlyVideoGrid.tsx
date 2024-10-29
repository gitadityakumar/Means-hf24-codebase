"use client"
import React, { useState } from 'react';
// import { VideoCard } from '@/components/ui/ProcessedVideoCard';
import { VideoCard } from '@/components/ui/ProcessedVideoCard';
import { groupVideosByMonth } from '@/lib/videoUtils';
import { Video } from '@/types/processedVideoTypes';
import { IconArrowDown } from '@tabler/icons-react';

interface MonthlyVideoGridProps {
  videos: Video[];
}

export const MonthlyVideoGrid: React.FC<MonthlyVideoGridProps> = ({ videos }) => {
  const groupedVideos = groupVideosByMonth(videos);
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});

  const toggleExpand = (month: string) => {
    setExpandedMonths(prev => ({
      ...prev,
      [month]: !prev[month]
    }));
  };

  return (
    <div className="space-y-12">
      {Object.entries(groupedVideos).map(([month, monthVideos]) => {
        const isExpanded = expandedMonths[month] || false;
        const displayedVideos = isExpanded ? monthVideos : monthVideos.slice(0, 4);
        const hasMoreVideos = monthVideos.length > 4;

        return (
          <div key={month}>
            <h2 className="text-2xl font-semibold mb-4 ">{month}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedVideos.map(video => (
                // <VideoCard key={video.id} video={video} />
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
            {hasMoreVideos && (
               
               <IconArrowDown
               className={`transition-transform duration-300 transform ${isExpanded ? 'rotate-180' : ''} 
               bg-transparent mt-3 flex justify-center items-center p-1 rounded-full shadow-md 
               hover:bg-gray-100 hover:shadow-lg active:shadow-inner`}
               onClick={() => toggleExpand(month)}
               aria-label={isExpanded ? "Show less videos" : "Show more videos"}
               size={28} 
               stroke={2}
               style={{ opacity: isExpanded ? 0.6 : 0.9 }} 
             />
             
              
            )}
          </div>
        );
      })}
    </div>
  );
};
