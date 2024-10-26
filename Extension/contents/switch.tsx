import { useState, useEffect } from 'react';
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo";
import { collectVideoData, setCollectionEnabled } from './content';
import type { VideoData } from './content';
import { getCurrentPlaytime } from './collection';
import { sendMessage } from './utils';
import { Storage } from "@plasmohq/storage"

const storage = new Storage();

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
};

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document.querySelector(`#end`);

export const getShadowHostId = () => "plasmo-inline-example-unique-id";

const Switch = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [currentVideoData, setCurrentVideoData] = useState<VideoData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const handleSwitchToggle = async () => {
    if (!isChecked) {
      try {
        const response = await chrome.runtime.sendMessage({ action: "authenticate" });
        if (response.userId) {
          setUserId(response.userId);
          await storage.set("userId", response.userId);  // Persist the userId
          setIsChecked(true);
          setCollectionEnabled(true);
          console.log('Authentication successful. User ID:', response.userId);
        } else {
          console.log('Authentication failed. User not logged in.');
          // For development, we'll set isChecked to true anyway
          setIsChecked(true);
          setCollectionEnabled(true);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        // For development, we'll set isChecked to true even if there's an error
        setIsChecked(true);
        setCollectionEnabled(true);
      }
    } else {
      setIsChecked(false);
      setCollectionEnabled(false);
      setUserId(null);
      await storage.remove("userId");  // Clear the persisted userId
      console.log('Data collection disabled.');
    }
  };

  const sendVideoData = async (videoData: VideoData, isFullData: boolean) => {
    if (!userId) {
      console.error("User ID is missing. Cannot send video data.");
      return;
    }
    try {
      const response = await sendMessage<{ status: string; data?: VideoData; message?: string }>({
        action: isFullData ? "collectAndSendVideoData" : "updateVideoPlaytime",
        videoData,
        userId
      });
      console.log('Raw response:', response);
      if (response.status === "success") {
        console.log(isFullData ? "Video data sent successfully:" : "Playtime updated successfully:", response.data);
      } else {
        console.error(isFullData ? "Failed to send video data:" : "Failed to update playtime:", response.message);
      }
    } catch (error) {
      console.error("Error sending video data:", error);
    }
  };

  useEffect(() => {
    const initializeUserId = async () => {
      const storedUserId = await storage.get("userId");
      if (storedUserId) {
        setUserId(storedUserId as string);  // Retrieve and set the persisted userId
      }
    };

    initializeUserId();  // Initialize the userId from storage

    setCollectionEnabled(isChecked);
    let intervalId: number | null = null;

    const checkAndSendVideoData = () => {
      if (window.location.hostname === 'www.youtube.com') {
        const newVideoData = collectVideoData();

        if (!currentVideoData || newVideoData.url !== currentVideoData.url) {
          setCurrentVideoData(newVideoData);
          sendVideoData(newVideoData, true);
          console.log('New video detected:', newVideoData.url);
        } else {
          const updatedPlaytime = getCurrentPlaytime();
          if (updatedPlaytime !== null && updatedPlaytime !== currentVideoData.playtime) {
            const updatedVideoData = { ...currentVideoData, playtime: updatedPlaytime };
            setCurrentVideoData(updatedVideoData);
            sendVideoData(updatedVideoData, false);
            console.log('Playtime updated:', updatedPlaytime);
          }
        }
      }
    };

    if (isChecked && userId) {
      console.log('Data collection enabled. Starting interval checks.');
      checkAndSendVideoData();
      intervalId = window.setInterval(checkAndSendVideoData, 5000);
    }

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
        console.log('Interval checks stopped.');
      }
    };
  }, [isChecked, currentVideoData, userId]);

  const switchStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: '50px',
    height: '34px'
  };

  const sliderStyle: React.CSSProperties = {
    position: 'absolute',
    cursor: 'pointer',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: isChecked ? '#666666' : '#ccc',
    transition: '0.4s',
    borderRadius: '34px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
  };

  const circleStyle: React.CSSProperties = {
    position: 'absolute',
    height: '26px',
    width: '26px',
    left: isChecked ? '24px' : '4px',
    bottom: '4px',
    backgroundColor: 'white',
    transition: '0.4s',
    borderRadius: '50%',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
  };

  return (
    <label style={switchStyle}>
      <input 
        type="checkbox" 
        checked={isChecked} 
        onChange={handleSwitchToggle} 
        style={{ opacity: 0, width: 0, height: 0 }} 
      />
      <span style={sliderStyle}>
        <span style={circleStyle}></span>
      </span>
    </label>
  );
};

export default Switch;
