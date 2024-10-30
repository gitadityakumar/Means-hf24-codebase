import youtubedl from 'yt-dlp-exec';

export async function getVideoDuration(videoUrl: string): Promise<number> {
  try {
    const metadata = await youtubedl(videoUrl, {
      dumpSingleJson: true, 
    });
    const durationInSeconds = metadata.duration;
    const durationInMinutes = (durationInSeconds / 60).toFixed(2); // Convert to minutes

    console.log(`Duration: ${durationInSeconds} seconds (${durationInMinutes} minutes)`);

    return durationInSeconds;
  } catch (error) {
    console.error('Error fetching video metadata:', error);
    throw new Error('Failed to fetch video metadata');
  }
}

// Parse duration string (e.g., "15:31") into seconds
export function parseDuration(duration: string): number {
  try {
    const [minutes, seconds] = duration.split(':').map(Number);

    if (isNaN(minutes) || isNaN(seconds)) {
      throw new Error('Invalid duration format');
    }

    const totalSeconds = (minutes * 60) + seconds;
    console.log(`Parsed duration: ${totalSeconds} seconds`);

    return totalSeconds;
  } catch (error) {
    console.error('Error parsing duration:', error);
    throw new Error('Failed to parse duration');
  }
}
