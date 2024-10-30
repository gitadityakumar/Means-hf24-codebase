import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Converts a VTT file to SRT format.
 * @param {string} vttFilename - The input VTT file path.
 * @param {string} srtFilename - The output SRT file path.
 */
export async function vttToSrt(vttFilename: string, srtFilename: string): Promise<void> {
  try {
    const vttData = (await fs.readFile(vttFilename, 'utf-8')).split('\n');
    const srtData: string[] = [];
    let count = 1;

    const timePattern = /(\d{2}:\d{2}:\d{2})\.(\d{3})/;
    const skipPattern = /^(WEBVTT|Kind:|Language:)/;

    for (const line of vttData) {
      if (skipPattern.test(line)) continue;

      const modifiedLine = line.replace(timePattern, '$1,$2');

      if (timePattern.test(modifiedLine)) {
        srtData.push(count.toString());
        count++;
      }

      srtData.push(modifiedLine.trim());
    }

    await fs.writeFile(srtFilename, srtData.join('\n'), 'utf-8');
  } catch (error) {
    //@ts-ignore
    console.error(`Failed to convert VTT to SRT:conveterScript.ts ${error.message || error}`);
  }
}

/**
 * Converts an SRT file to plain text.
 * @param {string} srtFilePath - The input SRT file path.
 * @param {string} outputFilePath - The output plain text file path.
 */
export async function convertSrtToTxt(srtFilePath: string, outputFilePath: string): Promise<void> {
  try {
    const srtContent = await fs.readFile(srtFilePath, 'utf-8');
    const lines = srtContent.split(/\r?\n/);

    const textLines: Set<string> = new Set();
    let currentText: string[] = [];

    lines.forEach(line => {
      if (!line.match(/^\d+$/) && !line.match(/\d{2}:\d{2}:\d{2}/)) {
        if (line.trim()) {
          currentText.push(line.trim());
        } else if (currentText.length > 0) {
          textLines.add(currentText.join(' '));
          currentText = [];
        }
      }
    });

    if (currentText.length > 0) {
      textLines.add(currentText.join(' '));
    }

    const plainText = Array.from(textLines).join('\n').replace(/\n{2,}/g, '\n');

    await fs.writeFile(outputFilePath, plainText);
    console.log('Conversion complete. Plain text saved to:conveterScript.ts', outputFilePath);
  } catch (error) {
    //@ts-ignore
    console.error(`Failed to convert SRT to plain text:conveterScript.ts ${error.message || error}`);
  }
}

// Example Usage
// (async () => {
//   const vttFilePath = path.join(__dirname, 'subtitles', 'input.vtt');
//   const srtFilePath = path.join(__dirname, 'subtitles', 'output.srt');
//   const txtFilePath = path.join(__dirname, 'subtitles', 'subtitles.txt');

//   await vttToSrt(vttFilePath, srtFilePath);
//   await convertSrtToTxt(srtFilePath, txtFilePath);
// })();


