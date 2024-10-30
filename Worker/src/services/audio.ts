import ytdlp from 'yt-dlp-exec';

//@ts-ignore
export async function downloadAudio(videoUri) {
  try {
    const output = '../../subtitles/audio.mp3'; 
    await ytdlp(videoUri, {
      output: output,
      extractAudio: true,
      audioFormat: 'wav', 
    });
    // console.log(`Audio downloaded to ${output}`);
    return output;
  } catch (error) {
    //@ts-ignore
    // console.error(`Error downloading audio: ${error.message}`);
    throw error;
  }
}

// Example usage
// const videoUri = 'https://www.youtube.com/watch?v=e5dhaQm_J6U';
// downloadAudio(videoUri).then((output) => {
//   // console.log(`Audio downloaded successfully: ${output}`);
// }).catch((error) => {
//   // console.error(`Failed to download audio: ${error}`);
// });
