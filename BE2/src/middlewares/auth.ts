import dotenv from "dotenv";
import { Client, Users } from "node-appwrite";

dotenv.config();

export async function fetchUserById(id:any) {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  const users = new Users(client);

  try {
    const result = await users.get(id); 
    // console.log(result);
    return result;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}


//check session using appwrite 