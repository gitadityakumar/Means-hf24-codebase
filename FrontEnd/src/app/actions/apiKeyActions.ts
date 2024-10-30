'use server'

import { MongoClient, ObjectId } from 'mongodb';
import { encrypt,  EncryptedData, isEncryptedData } from '@/lib/encryption';
import {getUser} from '@/app/actions/getUser'

const uri = process.env.MONGODB_URI as string;

interface ApiKeyDocument {
  _id: ObjectId;
  userId: string;
  service: string;
  encryptedKey: EncryptedData;
}

interface ActionResult {
  success: boolean;
  message?: string;
  apiKey?: object;
}



export async function storeApiKey(service: string, apiKey: string): Promise<ActionResult> {
  const client = new MongoClient(uri);
  
  try {
      const data = await getUser();
    const userId = data.userId;
    if (!userId) {
      return { success: false, message: "User not authenticated" };
    }

    await client.connect();
    const collection = client.db("videoDataDB").collection<ApiKeyDocument>("apiKeys");
    
    const encryptedKey = encrypt(apiKey);
    
    await collection.updateOne(
      { userId, service },
      { $set: { encryptedKey } },
      { upsert: true }
    );
    
    return { success: true, message: "API key stored successfully" };
  } catch (error) {
    console.error("Error storing API key:", error);
    return { success: false, message: "Error storing API key" };
  } finally {
    await client.close();
  }
}

export async function getApiKey(service: string): Promise<ActionResult> {
  const client = new MongoClient(uri);
  
  try {
    const data = await getUser();
    const userId = data.userId;
    if (!userId) {
      return { success: false, message: "User not authenticated" };
    }

    await client.connect();
    const collection = client.db("videoDataDB").collection<ApiKeyDocument>("apiKeys");
    
    const result = await collection.findOne({ userId, service });
    
    if (result && isEncryptedData(result.encryptedKey)) {
      // console.log(result.encryptedKey.encryptedData);
      // console.log(result.encryptedKey +":   #############")

      // const decryptedKey = decrypt(result.encryptedKey);
      return { success: true, apiKey: result.encryptedKey };
    } else {
      return { success: false, message: "API key not found or invalid" };
    }
  } catch (error) {
    console.error("Error retrieving API key:", error);
    return { success: false, message: "Error retrieving API key" };
  } finally {
    await client.close();
  }
}