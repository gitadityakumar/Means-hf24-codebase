"use client";
import React, { useState, useEffect } from "react";
import CardDemo from "@/components/blocks/cards-demo-2";
import PageHeader from "@/components/ui/pageheader";
import { Video, ApiResponse } from "@/types/video";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useProcessVideo } from "@/hooks/useProcessVideo"; 
import { ToastAction } from "@radix-ui/react-toast";
import { modeState } from "@/app/recoilContextProvider";
import { useRecoilState } from "recoil";

const Page = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasExtension, setHasExtension] = useState<boolean | null>(null);
  const [mode] = useRecoilState(modeState);
  const [token, setToken] = useState<string | null>(null);

  
  // Process the selected videos
  const { isProcessing, progress, processVideo,hookError } = useProcessVideo( 
    token
  );
  
  useEffect(()=>{
    const flow = fetch('/api/auth')
  },[]);
 // token useEffect
useEffect(() => {
  const fetchToken = async () => {
    try {
      const response = await fetch("/api/token");
      const data = await response.json();
      
      if (response.ok) {
        setToken(data.token);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  fetchToken();
}, []);
 //end here 
  useEffect(() => {
    if (hookError) {
      toast({
        title: "Error",
        description: hookError,
        variant: "destructive",
      });
    }
  }, [hookError]);

  useEffect(() => {
    if (progress === 100) {
      toast({
        title: "Success 👍👍", // or "Confirmation"
        description: "Video has been processed", 
        variant: "default",
      });
    }
  }, [progress]);
  

  // Fetch videos from the backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/db");
        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }
        const data: ApiResponse = await response.json();
        console.log(data);

        if (data.videos) {
          setVideos(data.videos);
          setHasExtension(true);
        } else if (data.message === "No data found") {
          setVideos([]);
          setHasExtension(data.hasExtension ?? false);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        setError("Failed to load videos. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Handle video selection
  const handleVideoSelect = (videoId: string) => {
    setSelectedVideoId(prevSelected => {
      const newSelected = prevSelected === videoId ? null : videoId;
  
      // Find the video based on the newly selected ID
      const video = videos.find(video => video._id === newSelected);
      const videoDuration = video?.duration;
      if(mode=="public"){
      if (videoDuration) {
        const durationInMs = parseDuration(videoDuration);
        // console.log(`Parsed duration (in ms): ${durationInMs}`); 
        if (durationInMs > 15 * 60 * 1000) {
          toast({
            title: "Uh oh! 😳",
            description: "To long to process,Please switch to private mode.",
            variant: "destructive",
            duration:1000,
            action: <ToastAction altText="Try again">Select again</ToastAction>
          });
        }
      }
    }
      return newSelected;
    });
  };
  
  // Function to parse duration from formats like "HH:MM:SS" or "MM:SS"
  const parseDuration = (durationString: string): number => {
    if (!durationString) return 0; 
    const parts = durationString.split(":").map(Number);
    let hours = 0, minutes = 0, seconds = 0;
    if (parts.length === 3) {
      // Format is "HH:MM:SS"
      [hours, minutes, seconds] = parts;
    } else if (parts.length === 2) {
      // Format is "MM:SS"
      [minutes, seconds] = parts;
    }
  
    const totalMilliseconds = (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
    // console.log(`Duration string: ${durationString}, Parsed: ${hours}h ${minutes}m ${seconds}s`);
    return totalMilliseconds;
  };
  
  // Trigger the video processing
  const handleProcess = async (): Promise<void> => {
    if (!selectedVideoId) {
      toast({
        title: "Uh oh! 😳",
        description: `Please select a video to process`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
   
      return Promise.resolve();  // Return a resolved Promise since the function expects a Promise
    }
  
    const selectedVideo = videos.find(video => video._id === selectedVideoId);
    if (selectedVideo) {
      await processVideo([selectedVideo]);  // Assuming processVideo is an async function
    } else {
      console.error("Selected video not found in videos array");
    }
  };
  
  const renderContent = () => {
    if (error) {
      return (
        <div className="flex items-center justify-center h-full ">
          <div className="text-red-500 text-center">
            <p className="text-xl font-semibold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-neutral-200 dark:bg-neutral-700 rounded-lg p-4 animate-pulse"
            >
              <div className="h-40 bg-neutral-300 dark:bg-neutral-600 rounded-md mb-4"></div>
              <div className="h-4 bg-neutral-300 dark:bg-neutral-600 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-neutral-300 dark:bg-neutral-600 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      );
    }

    if (videos.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-xl font-semibold mb-2">No Videos Available</p>
            {hasExtension === false ? (
              <p className="text-gray-600 dark:text-gray-400">
                Please download our extension from the store to start collecting data.
              </p>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                You haven&#39;t processed any videos yet. Start using our extension to collect data!
              </p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
        {videos.map((video) => (
          <CardDemo
          key={video._id }
          video={video}
          onSelect={handleVideoSelect}
          isSelected={selectedVideoId === video._id}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-slate-50 h-full w-full overflow-x-hidden ">
      <div className="flex-shrink-0 p-4">
        <PageHeader
          onProcess={handleProcess}
          isProcessing={isProcessing} 
          progress={progress}
        />
      </div>

      <div className="flex-grow overflow-auto ">
        <div className="bg-slate-50 dark:bg-neutral-900 rounded-lg shadow-lg p-6 min-h-full">
          {renderContent()}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Page;





