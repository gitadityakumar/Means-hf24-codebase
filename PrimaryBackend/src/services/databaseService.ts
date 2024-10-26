import { MongoClient, Db } from "mongodb";
import { getProcessedVideoData, clearVideoDataMap } from "./videoDataService";
import dotenv from 'dotenv'
dotenv.config();

let db: Db;

async function connectToDatabase() {
  if (!db) {
    const client = new MongoClient(process.env.DB_URL || "");
    await client.connect();
    db = client.db("videoDataDB");
    console.log("Connected to MongoDB");
  }
}

export async function updateDatabase(dataArray: any[]) {
  if (dataArray.length === 0) {
    console.log("No data to update in the database");
    return;
  }

  await connectToDatabase();

  console.log("Updating database with:", dataArray);

  const collection = db.collection("videoData");

  const bulkOps = dataArray.map((data) => ({
    updateOne: {
      filter: { url: data.url, userId: data.userId },
      update: { $set: data },
      upsert: true,
    },
  }));

  if (bulkOps.length > 0) {
    const result = await collection.bulkWrite(bulkOps);
    console.log(
      `${result.modifiedCount} documents updated, ${result.upsertedCount} documents inserted.`
    );
  } else {
    console.log("No data to update in the database");
  }
}

export function startPeriodicDatabaseUpdate(
  intervalMs: number = 1 * 60 * 1000
) {
  setInterval(async () => {
    const dataToUpdate = getProcessedVideoData();
    await updateDatabase(dataToUpdate);
    clearVideoDataMap();
    console.log("Database updated and in-memory storage cleared");
  }, intervalMs);
}

// Function to access data from the database

export async function getProcessedDataFromDB() {
  try {
    await connectToDatabase(); // Ensure the database is connected
    const collection = db.collection("videoData"); // Replace with your collection name
    const processedData = await collection.find({ processed: false }).toArray();
    return processedData;
  } catch (error) {
    console.error("Error fetching processed data from DB:", error);
    return [];
  }
}
