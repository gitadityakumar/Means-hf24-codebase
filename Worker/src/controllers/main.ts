import path from 'path';
import fs from 'fs';
import { downloadSubtitles } from '../services/subtitles';
import { convertSrtToTxt, vttToSrt } from '../services/convertScript';
import { downloadAudio } from '../services/audio';
import { main } from '../llm/graq';
import { gemini } from '../llm/gemini';
import { parseLLMResponse } from '../utils/jsonParse';
import { storeVideoData } from '../utils/dbOperation';
import * as dotenv from "dotenv";
import { decrypt, EncryptedData } from '../utils/decryption';
dotenv.config();
interface VideoDetails {
  title: string;
  duration: string;
  thumbnailUrl: string;
  userId: string;
  model: string;
  usage: string;
}

interface ParsedLLMData {
  word: string;
  meaning: string;
}



interface ApiResponse {
 
  Data: {
    url: string;
    title: string;
    userId:string;
    duration:number;
    thumbnailUrl:string;
  }[];
  usage: string;
  model: string | null;
  key: EncryptedData;
}

export async function processing(
  data: ApiResponse,
  progress: (progress: number) => Promise<void>
) {
  const videoUrl = data.Data[0].url;   
  const videoTitle = data.Data[0].title; 
  const userId = data.Data[0].userId;
  const duration = data.Data[0].duration;
  const thumbnailUrl = data.Data[0].thumbnailUrl;
  const usage = data.usage; 
  const model = data.model; 
  const userKey = data.key;
  let apiKey ;
  const subtitleLanguage = 'en'; 
  const outputDirectory = './subtitles';

  //load api key based on mode and model 
  if(usage === "public"){
      apiKey = process.env.GEMINI_API_KEY;
  }else{
    apiKey = decrypt(userKey);
  }

  try {
    // Step 1: Try to download subtitles
    await downloadSubtitles(videoUrl, subtitleLanguage, outputDirectory);
    const subtitleFiles = await fs.promises.readdir(outputDirectory);
    const vttFile = subtitleFiles.find((file) => file.endsWith('.vtt'));
    await progress(60); 
    

    // Check if VTT file was found
    if (!vttFile) {
      throw new Error('No VTT file found after subtitle download.');
    }

    // Step 2: Convert VTT to SRT and TXT
    const vttFilePath = path.join(outputDirectory, vttFile);
    const srtFilePath = vttFilePath.replace('.vtt', '.srt');
    const txtFilePath = vttFilePath.replace('.vtt', '.txt');
    await vttToSrt(vttFilePath, srtFilePath);
    await progress(70); 
    await convertSrtToTxt(srtFilePath, txtFilePath);
    await progress(80); 

    // Step 3: Send TXT to LLM for processing
    const llmResponse = await sendToLLM(txtFilePath,model,apiKey!);
    const parsedData = parseLLMResponse(llmResponse);
    // save  data to db 
    const videoDetails: VideoDetails = {
      title: videoTitle,
      duration: duration.toString(),  
      thumbnailUrl: thumbnailUrl,  
      userId: userId, 
      model: model || 'Gemini', 
      usage: usage
    };

    await sendToDb(videoDetails, parsedData);
    

    await progress(90); 

    // Log and clean up
    
    await cleanUpSubtitles(outputDirectory);
    await progress(100); 
  } catch (subtitleError) {
    console.error('Failed to download or process subtitles:', subtitleError);

    try {
      // Step 4: Fallback to download and process audio if subtitles fail
      await progress(60); 
      const audioOutput = await downloadAudio(videoUrl);
      const Key = apiKey;
      const llmResponse = await sendToLLM(audioOutput,model,Key!);
      
      const parsedData = parseLLMResponse(llmResponse);
      // save  data to db 
      const videoDetails: VideoDetails = {
        title: videoTitle,
        duration: duration.toString(),  
        thumbnailUrl: thumbnailUrl,  
        userId: userId, 
        model: model || 'Gemini', 
        usage: usage
      };
  
      await sendToDb(videoDetails, parsedData);

      await progress(90); // Progress after audio fallback and LLM processing

      await cleanUpSubtitles(outputDirectory);
      await progress(100); 
    } catch (audioError) {
      console.error('Failed to download audio:', audioError);
      throw new Error('Processing failed. Could not download subtitles or audio.');
    }
  }
}

// Helper function to clean up the subtitles directory
async function cleanUpSubtitles(directory: string) {
  try {
    if (fs.existsSync(directory)) {
      const files = await fs.promises.readdir(directory);
      for (const file of files) {
        const filePath = path.join(directory, file);
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath); // Delete the file if it exists
        }
      }

      // Remove the directory itself (recursive option for future-proofing)
      await fs.promises.rm(directory, { recursive: true, force: true });
      console.log('Subtitles directory cleaned up successfully.');
    }
  } catch (error) {
    console.error('Failed to clean up subtitles directory:', error);
  }
}

// for LLM API call
async function sendToLLM(filePath: string, model: string | null, key: string | null): Promise<any> {
  try {
    // Normalize model to lowercase for consistent comparison
    const normalizedModel = model?.toLowerCase() || null;
    const useGemini = normalizedModel === 'gemini' || (normalizedModel === null && !!key);

    // console.log(`Selected Model: ${normalizedModel}`);
    // console.log(`Use Gemini: ${useGemini}`);
    // console.log(`API Key provided: ${key ? '[Key Present]' : '[No Key]'}`);

    if (useGemini) {
      if (!key) {
        throw new Error('Private API key is required for Gemini in private mode.');
      }
      console.log(`Calling gemini with key: ${key ? '[Key Present]' : '[No Key]'}`);
      return await gemini(filePath, key);
    } else {
      console.log(`Calling main with key: ${key ? '[Key Present]' : '[No Key]'}`);
      return await main(filePath, key || '');
    }
  } catch (error) {
    console.error('Error in LLM processing:', error);
    throw new Error('LLM processing failed.');
  }
}




async function sendToDb(videoDetails: VideoDetails, parsedLLMData: ParsedLLMData[]) {
  try {
    const result = await storeVideoData(videoDetails, parsedLLMData);
    console.log('Successfully processed and stored data:');
  } catch (error) {
    console.error('Error processing video task:', error);
  }
}