'use server'
import { getUser } from "./getUser";
import { connectToDatabase } from "@/lib/mongodb";
import { Video } from '@/types/processedVideoTypes';

export async function fetchProcessedVideos(): Promise<Video[]> {
  const data = await getUser();
   const  userId  = data.userId

  if (!userId) {
    throw new Error('Not authenticated');
  }

  try {
    const { db } = await connectToDatabase();

    const videoCards = await db
      .collection('videocards')
      .find({ userId })
      .toArray();

    // Map the MongoDB documents to your Video type
    const videos: Video[] = videoCards.map(card => ({
      id: card._id.toString(), // Assuming MongoDB's _id is used as the id
      title: card.title,
      thumbnailUrl: card.thumbnailUrl,
      duration: card.duration,
      processingDate: new Date(card.processingDate).toISOString(), // Convert to ISO string format
    }));
    console.log(videos);
    return videos;
  } catch (error) {
    console.error('Error fetching processed videos:', error);
    throw error;
  }
}