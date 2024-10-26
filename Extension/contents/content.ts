import { debounce } from './utils';
import { STORAGE_KEY, DEBOUNCE_DELAY } from './config';
import { getCurrentVideoUrl, getCurrentThumbnailUrl, getCurrentVideoTitle, getChannelName, getCurrentVideoDuration, getCurrentPlaytime,getChannelAvatarUrl } from './collection'


 export interface VideoData {
  url: string;
  thumbnailUrl: string | null;
  channelAvatar:string | null;
  title: string | null;
  channelName: string | null;
  duration: string | null;
  playtime: number | null;
  processed: boolean;
}


let isCollectionEnabled = false;

export function setCollectionEnabled(enabled: boolean) {
  isCollectionEnabled = enabled;
}

// Function to collect video data
export function collectVideoData(): VideoData {
  try {
    return {
      // id: generateId(),

      url: getCurrentVideoUrl(),
      thumbnailUrl: getCurrentThumbnailUrl(),
      channelAvatar:getChannelAvatarUrl(),
      title: getCurrentVideoTitle(),
      channelName: getChannelName(),
      duration: getCurrentVideoDuration(),
      playtime: getCurrentPlaytime(),
      processed: false,
    };
  } catch (error) {
    console.error('Error collecting video data:', error);
    return {} as VideoData;
  }
}

// Function to set up the MutationObserver
export function setupMutationObserver(): Promise<boolean> {
  return new Promise((resolve) => {
    const video = document.querySelector('video');
    
    if (video) {
      const handleMutation = debounce(() => {
        console.log('Video source changed:', video.src);
        observer.disconnect();
        resolve(true);
      }, DEBOUNCE_DELAY);

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
            handleMutation();
          }
        });
      });

      observer.observe(video, { attributes: true });
    } else {
      console.error('Video element not found');
      resolve(false);
    }
  });
}

// Function to save data locally
function saveVideoDataLocally(videoData: VideoData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videoData));
  } catch (error) {
    console.error('Error saving video data locally:', error);
  }
}

// Function to get data from local storage
function getVideoDataFromLocalStorage(): VideoData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving video data from local storage:', error);
    return null;
  }
}

// Function to handle page visibility change
function handleVisibilityChange(): void {
  if (document.visibilityState === 'hidden' && isCollectionEnabled) {
    const videoData = collectVideoData();
    console.log('Page hidden, saving video data:', videoData);
    saveVideoDataLocally(videoData);
    chrome.runtime.sendMessage({ action: "collectAndSendVideoData", videoData });
  }
}

// Check local storage on page load and send data if available
function checkAndSendLocalData(): void {
  if (isCollectionEnabled) {
    const savedData = getVideoDataFromLocalStorage();
    if (savedData) {
      console.log('Found saved video data, sending to backend:', savedData);
      chrome.runtime.sendMessage({ action: "collectAndSendVideoData", videoData: savedData });
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

document.addEventListener('visibilitychange', handleVisibilityChange);
window.addEventListener('load', checkAndSendLocalData);

// Initialize the MutationObserver
setupMutationObserver();