// Function to get the current YouTube video URL
export function getCurrentVideoUrl(): string {
  return window.location.href;
}

// Function to get the current playtime
export function getCurrentPlaytime(): number | null {
  const video = document.querySelector('video');
  return video ? video.currentTime : null;
}

// Function to get the current channel name
export function getChannelName(): string | null {
  const ownerDiv = document.getElementById('owner');
  if (!ownerDiv) {
    console.error("Owner div not found");
    return null;
  }

  const anchorTag = ownerDiv.querySelector('a[href*="/@"]');
  if (!anchorTag) {
    console.error("Channel anchor tag not found");
    return null;
  }

  const href = anchorTag.getAttribute('href') ?? '';
  const channelName = href.split('/@')[1] || '';
  
  return channelName || null;
}

// Function to get the current video's thumbnail URL
export function getCurrentThumbnailUrl(): string | null {
  const videoUrl = getCurrentVideoUrl();
  const videoId = new URLSearchParams(new URL(videoUrl).search).get('v');
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  } else {
    console.error("Video ID not found");
    return null;
  }
}

// Function to get current video's title 
export function getCurrentVideoTitle(): string | null {
  const titleElement = document.querySelector('#title h1 yt-formatted-string');
  return titleElement ? titleElement.textContent : 'Title not found';
}

// Function to get current video's duration 
export function getCurrentVideoDuration(): string | null {
  const durationElement = document.querySelector('.ytp-time-duration');
  return durationElement ? durationElement.textContent : 'Duration not found';
}

// New function to get the channel avatar image link
// Function to get the channel avatar image link
export function getChannelAvatarUrl(): string | null {
  const avatarImg = document.querySelector('#owner img#img');
  if (avatarImg instanceof HTMLImageElement) {
    return avatarImg.src;
  } else {
    console.error("Channel avatar image not found");
    return null;
  }
}

