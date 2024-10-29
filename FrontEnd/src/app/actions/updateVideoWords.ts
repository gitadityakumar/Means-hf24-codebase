"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function updateVideoWords(
  videoId: string,
  updatedWords: { id: number; word: string; meaning: string }[]
) {
  try {
    const { db } = await connectToDatabase();

    const videoCard = await db
      .collection("videocards")
      .findOne({ _id: new ObjectId(videoId) });
    if (!videoCard) {
      throw new Error("Video not found");
    }

    const initialDataIds = videoCard.initialData.map(
      (id: string) => new ObjectId(id)
    );
    const initialData = await db
      .collection("initialdatas")
      .find({ _id: { $in: initialDataIds } })
      .toArray();

    // Update each word in the database
    for (const updatedWord of updatedWords) {
      const correspondingData = initialData[updatedWord.id - 1];
      if (correspondingData) {
        await db
          .collection("initialdatas")
          .updateOne(
            { _id: correspondingData._id },
            { $set: { word: updatedWord.word, meaning: updatedWord.meaning } }
          );
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating words:", error);
    throw error;
  }
}
