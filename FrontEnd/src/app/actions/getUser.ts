'use server'

import { getLoggedInUser } from "@/lib/server/appwrite";

export async function getUser() {
  try {
    const user = await getLoggedInUser();
    
    if (!user) {
      return {
        name: '',
        userId: '',
      };
    }

    return {
      name: user.name,
      userId: user.$id,
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return {
      name: '',
      userId: '',
    };
  }
}