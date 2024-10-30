const ytDlp = require('yt-dlp-exec');
const fs = require('fs');
const path = require('path');

/**
 * Downloads subtitles in SRT format for a specific language.
 * @param {string} url 
 * @param {string} language 
 * @param {string} outputDir 
 */
export async function downloadSubtitles(url: string, language = 'en', outputDir = './subtitles') {
  try {
    if (!fs.existsSync(outputDir)) {
      await fs.promises.mkdir(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, '%(title)s.%(ext)s');

    // Construct the command arguments correctly
    const args = [
      url,                     
      '--sub-lang', language,  
      '--sub-format', 'vtt',   
      '--write-subs',
      '--write-auto-sub',      
      '--skip-download',       
      '--output', outputPath,  // Save the subtitles in the specified directory
    ];

    // Run yt-dlp with the constructed arguments
    await ytDlp.exec(args);

    const subtitleFiles = await fs.promises.readdir(outputDir);

    const vttFiles = subtitleFiles.filter((file: string) => file.endsWith('.vtt'));
    if (vttFiles.length === 0) {
      console.log('No subtitles downloaded.');
    } else {
      vttFiles.forEach((file: any) => {
        console.log(`Subtitle file found: ${file}`);
      });
    }
  } catch (error) {
    //@ts-ignore
    console.error('Failed to download subtitles:', error.message || error);
  }
}

// Example usage
// const videoUrl = 'https://www.youtube.com/watch?v=e5dhaQm_J6U';
// const subtitleLanguage = 'en'; 
// const outputDirectory = './subtitles'; 
// downloadSubtitles(videoUrl, subtitleLanguage, outputDirectory);
