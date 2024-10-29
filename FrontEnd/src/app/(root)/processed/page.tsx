import React from 'react';
import { MonthlyVideoGrid } from '@/components/ui/MonthlyVideoGrid';
import { fetchProcessedVideos } from '@/app/actions/fetchProcessedVideos';

export default async function ProcessedPage() {
  try {
    const videos = await fetchProcessedVideos();

    return (
      <div className="flex flex-col h-full w-full overflow-hidden">
        <header className="bg-slate-100 dark:bg-slate-800 py-4 flex-shrink-0">
          <div className="container mx-auto px-4 flex items-center justify-center">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 dark:from-purple-300 dark:to-pink-500">
              PROCESSED VIDEOS
            </h1>
          </div>
        </header>
        <main className="flex-grow overflow-auto">
          
          <div className="container mx-auto px-4 py-8">
            <MonthlyVideoGrid videos={videos} />
          </div>
        </main>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-center bg-gradient-to-l from-white/25 to-white/50 flex-grow overflow-hidden">
        <p className="text-xl font-semibold text-red-600">
          Error Fetching Data
        </p>
      </div>
    );
    
  }
}