import { activeServiceState, modeState,apiKeyDataState } from "@/app/recoilContextProvider";
import { Video } from "@/types/video";
import { useState } from "react";
import { useRecoilState } from "recoil";
// import { useUser } from "@clerk/nextjs";

require("dotenv").config();

const uri = process.env.NEXT_PUBLIC_SECONDRY_BACKEND_URL;

export const useProcessVideo = (token: string | null) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [hookError, setHookError] = useState<string | null>(null);
  const [mode] = useRecoilState(modeState);
  const [model] = useRecoilState(activeServiceState);
  // const { user } = useUser();
  const [key] = useRecoilState(apiKeyDataState);

  const processVideo = async (selectedVideos: Video[]) => {
    if (!selectedVideos) return;

    setIsProcessing(true);
    setHookError(null);

    try {
      // Check quota only if mode is public
      // if (mode === "public") {
      //   const currentVal = user?.publicMetadata.currentCount as number | null;
      //   const totalVal = user?.publicMetadata.limit as number | null;
      
      //   // Check if values are not null or undefined before comparing
      //   if (currentVal !== null && totalVal !== null) {
      //     if (currentVal >= totalVal) {
      //       setHookError("Quota exceeded. Try again tomorrow or switch to private mode");
      //       setIsProcessing(false);
      //       return;
      //     }
      //   } else {
      //     setHookError("Error fetching quota data. Please try again later.");
      //     setIsProcessing(false);
      //     return;
      //   }
      // }
      
      //
      const response = await fetch(`${uri}/api/v1/processVideo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          videoData: selectedVideos,
          usage: mode,
          model: model,
          apikey:key
        }),
      });

      if (response.ok) {
        const { jobId } = await response.json();
        pollProgress(jobId);
      } else {
        setHookError("Failed to process video");
        console.error("Failed to process video");
        setIsProcessing(false);
      }
    } catch (error) {
      setHookError("Error processing video");
      console.error("Error processing video:", error);
      setIsProcessing(false);
    }
  };

  const pollProgress = (jobId: string) => {
    const intervalId = setInterval(async () => {
      try {
        const progressResponse = await fetch(
          `${uri}/api/v1/jobStatus/${jobId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (progressResponse.ok) {
          const { progress } = await progressResponse.json();
          setProgress(progress);

          if (progress >= 100) {
            clearInterval(intervalId);
            setIsProcessing(false);

            // Update quota only if mode is public and processing is complete
            // if (mode === "public") {
            //   try {
            //     await quotaUpdate();
            //   } catch (error) {
            //     console.error("Error updating quota:", error);
            //     // Note: We're not setting hookError here to avoid disrupting the UI after successful processing
            //   }
            // }
          }
        } else {
          const message = await progressResponse.json();
          setHookError(`Failed to fetch job status: ${message.error}`);
          clearInterval(intervalId);
          setIsProcessing(false);
        }
      } catch (error) {
        setHookError("Error fetching progress");
        console.error("Error fetching progress:", error);
        clearInterval(intervalId);
        setIsProcessing(false);
      }
    }, 2000);
  };

  return { isProcessing, progress, processVideo, hookError };
};
