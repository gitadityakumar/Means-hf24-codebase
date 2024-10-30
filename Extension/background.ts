let storedUserId: string | null = null;

async function authenticateUser(): Promise<any> {
  try {
    const response = await fetch('http://localhost:3002/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "key": "ADI" })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('bg.ts***Authentication response:', data);
      if (data.userData) {
        storedUserId = data.userData;
        return data.userData;
      } else {
        console.log('bg.ts**No user data in response');
        return null;
      }
    } else {
      console.log('bg.ts**Authentication failed:', response.status);
      showLoginPopup(); // Call the function if authentication fails
      return null;
    }
  } catch (error) {
    console.error('bg.ts**Authentication error:', error);
    showLoginPopup(); // Call the function if there’s an error
    return null;
  }
}


async function sendVideoDataToBackend(videoData: any, userId?: string) {
  try {
    const response = await fetch('http://localhost:3002/url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...videoData, userId: userId || storedUserId || 'anonymous' })
    });
    const rawText = await response.text();
    console.log('Raw response text:', rawText);
    try {
      const data = JSON.parse(rawText);
      console.log('Video data sent successfully:', data);
      return data;
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      return { status: 'error', message: 'Invalid JSON response from server' };
    }
  } catch (error) {
    console.error('Error sending video data:', error);
    throw error;
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "authenticate") {
    authenticateUser().then(userId => {
      sendResponse({ userId: userId });
    });
    return true;
  }

  if (message.action === "collectAndSendVideoData") {
    const videoData = message.videoData;
    const userId = message.userId || storedUserId;
    
    sendVideoDataToBackend(videoData, userId)
      .then((data) => sendResponse({ status: "success", data: data }))
      .catch((error) => sendResponse({ status: "error", message: error.message }));

    return true;
  }
});

function showLoginPopup() {
  chrome.windows.create({
    url: 'http://localhost:3000/sign-up', // Your Next.js login page URL
    type: 'popup',
    width: 400,
    height: 600
  });
}