import VideoCard from '../models/videoCard'; 
import  InitialData  from '../models/initialData';  
import mongoose from 'mongoose';
import dbConnect from './dbConnect';

// Function to create new VideoCard and InitialData documents in the DB
export async function storeVideoData(
  videoDetails: {
    title: string;
    duration: string;
    thumbnailUrl: string;
    userId: string;  // Clerk user ID
    model: string;   // Model used for LLM
    usage: string;   // LLM usage stats
  },
  parsedLLMData: { word: string; meaning: string }[]
) {
  try {
     // Ensure the database is connected
    await dbConnect();  
    // Step 1: Create and save VideoCard document
    const newVideoCard = new VideoCard({
      title: videoDetails.title,
      thumbnailUrl: videoDetails.thumbnailUrl,
      duration: videoDetails.duration,
      processingDate: new Date(),
      models: videoDetails.model,
      usage: videoDetails.usage,
      userId: videoDetails.userId
    });
    
    const savedVideoCard = await newVideoCard.save();
    console.log('VideoCard saved');

    // Step 2: Store InitialData (word-meaning pairs)
    const initialDataIds: mongoose.Types.ObjectId[] = [];

    for (const wordObj of parsedLLMData) {
      const { word, meaning } = wordObj;

      if (!word || !meaning) {
        console.warn('Skipping invalid word object:', wordObj);
        continue;  // Skip invalid entries
      }

      const newInitialData = new InitialData({
        word,
        meaning,
        createdAt: new Date()
      });

      const savedInitialData = await newInitialData.save();
      initialDataIds.push(savedInitialData._id as mongoose.Types.ObjectId);  // Store the new InitialData ID
    }

    // Step 3: Update VideoCard with initialData references
    savedVideoCard.initialData = initialDataIds;
    await savedVideoCard.save();

    console.log('VideoCard updated with InitialData:');
    return savedVideoCard;  // Return the fully updated VideoCard

  } catch (error) {
    console.error('Error storing video data in DB:', error);
    throw new Error('Failed to store video data.');
  }
}
