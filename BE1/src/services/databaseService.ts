import axios from 'axios';
import { getProcessedVideoData, clearVideoDataMap } from './videoDataService';
import dotenv from 'dotenv';
dotenv.config();

const appwriteEndpoint = process.env.APPWRITE_ENDPOINT || '';
const appwriteProjectId = process.env.APPWRITE_PROJECT_ID || '';
const appwriteAPIKey = process.env.APPWRITE_API_KEY || '';

async function updateDatabase(dataArray: any[]) {
  if (dataArray.length === 0) {
    console.log('No data to update in the database');
    return;
  }

  console.log('Updating database with:', dataArray);

  try {
    const response = await axios.post(
      `${appwriteEndpoint}/database/collections/videoData/documents`,
      {
        documents: dataArray.map(data => ({
          url: data.url,
          userId: data.userId,
          ...data // Include other fields as needed
        }))
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': appwriteProjectId,
          'X-Appwrite-Key': appwriteAPIKey
        }
      }
    );

    console.log(`${response.data.modified} documents updated, ${response.data.updated} documents inserted.`);
  } catch (error) {
     //@ts-ignore
    console.error('Error updating database:', error.response?.data || error.message);
  }
}

export function startPeriodicDatabaseUpdate(intervalMs: number = 1 * 60 * 1000) {
  setInterval(async () => {
    const dataToUpdate = getProcessedVideoData();
    await updateDatabase(dataToUpdate);
    clearVideoDataMap();
    console.log('Database updated and in-memory storage cleared');
  }, intervalMs);
}

// Function to access data from the database
export async function getProcessedDataFromDB() {
  try {
    const response = await axios.get(
      `${appwriteEndpoint}/database/collections/videoData/documents?filters=processed=false`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': appwriteProjectId,
          'X-Appwrite-Key': appwriteAPIKey
        }
      }
    );

    return response.data.documents;
  } catch (error) {
    //@ts-ignore
    console.error('Error fetching processed data from DB:', error.response?.data || error.message);
    return [];
  }
}
