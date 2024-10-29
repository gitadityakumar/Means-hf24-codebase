"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from 'next/link';
import { IconCircleCheck, IconCircleCheckFilled } from '@tabler/icons-react';
import { CardDemoProps } from "@/types/cardDemo2";


export default function CardDemo({ video, onSelect, isSelected  }: CardDemoProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  //  const [isSelected, setIsSelected] = useState(false);
  const {
    _id,
    channelName,
    channelAvatar,
    duration,
    playtime,
    thumbnailUrl,
    title,
    url
  } = video;

  // Calculate progress percentage
  const totalSeconds = duration.split(':').reduce((acc, time) => (60 * acc) + parseInt(time, 10), 0);
  const progressPercentage = totalSeconds > 0 ? (playtime / totalSeconds) * 100 : 0;

  const getHighQualityThumbnail = (url: string) => url.replace('hqdefault', 'maxresdefault');

  const handleSelect = () => {
    // console.log("CardDemo: handleSelect called for video:", video);
    if (video && video._id) {
      // console.log("CardDemo: Calling onSelect with:", video._id);
      onSelect(video._id);
    } else {
      console.error("CardDemo: Invalid video object structure:", JSON.stringify(video, null, 2));
    }
  };

  if (!video) {
    console.error("CardDemo: Received undefined video");
    return null; 
  }

  return (
    <div className="max-w-xs w-full group/card mt-2">
      <div className={cn(
        "cursor-pointer overflow-hidden relative card h-auto rounded-md shadow-xl max-w-sm mx-auto flex flex-col justify-between p-4",
        "bg-white/5 transition-transform duration-300 ease-in-out transform group-hover/card:scale-105"
      )}>
        {/* Channel info */}
        <div className="flex flex-row items-center space-x-4 z-10 mb-4">
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <Image
              src={channelAvatar}
              alt={channelName}
              width={40}
              height={40}
            />
          </div>
          <Link href={url} className="flex flex-col hover:underline">
            <p className="font-normal text-base text-gray-800 relative z-10">
              {channelName}
            </p>
          </Link>
        </div>

        {/* Thumbnail image */}
        <div className="relative mb-4">
          <Image
            src={getHighQualityThumbnail(thumbnailUrl)}
            alt={title}
            width={320}
            height={180}
            className="rounded-md"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {duration}
          </div>
        </div>

        {/* Video title */}
        <div className="text content">
          <h1 className="font-bold text-xl md:text-2xl text-gray-800 relative z-10 line-clamp-2 transition-transform duration-300 group-hover/card:translate-y-[-4px]">
            {title}
          </h1>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300">
          <div 
            className="h-full bg-red-600" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Check button */}
        <div 
          className="absolute top-2 right-2 z-20 transition-all duration-300 ease-in-out" 
          onClick={handleSelect}
        >
          { isSelected ? (           
            <IconCircleCheckFilled 
            className="text-blue-500"
            size={28}
          />
          ) : (
            <IconCircleCheck 
            className={`${isProcessing ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'} ` }
            size={28}
            />
          )}
        </div>
      </div>
    </div>
  );
}