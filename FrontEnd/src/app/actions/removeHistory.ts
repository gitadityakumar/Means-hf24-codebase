// 'use server';

// import { connectToDatabase } from "@/lib/mongodb";
// import { getUser } from "@/app/actions/getUser";

// export async function removeVideoWords() {
//   try {
//     // Get the userId from the authenticated user
//     const data = await getUser();
//     const userId = data.userId;

//     // Connect to the database
//     const { db } = await connectToDatabase();

//     // Delete all documents from videoData collection based on userId
//     const deleteResult = await db.collection('videoData').deleteMany({ userId });

//     console.log(`Deleted ${deleteResult.deletedCount} documents for user ${userId}`);

//     return {
//       success: true,
//       message: `Deleted ${deleteResult.deletedCount} documents for user ${userId}`
//     };
//   } catch (error) {
//     console.error('Error deleting video words:');
//     throw new Error('Failed to delete video words.');
//   }
// }
// src/app/actions/deleteData.ts

'use server';

import { connectToDatabase } from "@/lib/mongodb";
import { getUser } from "@/app/actions/getUser";

export async function deleteData(actionId: string) {
  const { db } = await connectToDatabase();
  const user = await getUser();

  if (!user) throw new Error('User not found');

  const { userId } = user;

  try {
    switch (actionId) {
      case 'history':
        // Delete all history documents associated with the user
        await db.collection('videoData').deleteMany({ userId });
        return { success: true, message: 'History deleted successfully' };

      case 'apiKeys':
        // Delete all API keys associated with the user
        await db.collection('apiKeys').deleteMany({ userId });
        return { success: true, message: 'API Keys deleted successfully' };

      case 'video':
        // Delete all video data associated with the user
        await db.collection('videocards').deleteMany({ userId });
        return { success: true, message: 'Processed video data deleted successfully' };

      default:
        throw new Error('Invalid action ID');
    }
  } catch (error) {
    console.error('Error deleting data:', error);
    throw new Error('Failed to delete data');
  }
}
