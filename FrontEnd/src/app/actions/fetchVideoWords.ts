'use server'

import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function fetchVideoWords(videoId: string) {
  try {
    const { db } = await connectToDatabase();

    // Fetch the video card
    const videoCard = await db.collection('videocards').findOne({ _id: new ObjectId(videoId) });

    if (!videoCard) {
      throw new Error('Video not found');
    }

    // Fetch the initial data (words and meanings)
    const initialDataIds = videoCard.initialData.map((id: string) => new ObjectId(id));
    const initialData = await db.collection('initialdatas')
      .find({ _id: { $in: initialDataIds } })
      .toArray();

    // Transform the data to match the component's expected format
    const wordMeanings = initialData.map((item, index) => ({
      id: index + 1, // Use a simple numeric id for the client
      word: item.word,
      meaning: item.meaning
    }));

    return {
      wordMeanings
    };
  } catch (error) {
    console.error('Error fetching video words:', error);
    throw error;
  }
}