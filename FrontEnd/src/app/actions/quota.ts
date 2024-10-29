'use server'

import { clerkClient, auth } from '@clerk/nextjs/server';

const DAILY_LIMIT = 15;
const RESET_INTERVAL = 24 * 60 * 60 * 1000; 

export async function quotaUpdate(): Promise<{ success: boolean }> {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await clerkClient.users.getUser(userId);
  const metadata = user.publicMetadata;

  const currentTime = Date.now();
  const lastResetTime = metadata.resetTime as number || 0;
  let currentCount = metadata.currentCount as number || 0;

  // Reset quota if 24 hours have passed
  if (currentTime - lastResetTime >= RESET_INTERVAL) {
    currentCount = 0;
  }

  // Check if quota is exceeded
  if (currentCount >= DAILY_LIMIT) {
    return { success: false };
  }

  // Increment usage count
  currentCount++;

  // Update user metadata
  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      limit: DAILY_LIMIT,
      currentCount: currentCount,
      remainingQuota: DAILY_LIMIT - currentCount,
      resetTime: currentTime - lastResetTime >= RESET_INTERVAL ? currentTime : lastResetTime,
    },
  });

  return { success: true };
}


