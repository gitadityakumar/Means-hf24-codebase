"use client";

import { useEffect, useState } from 'react';
import Header from '@/components/blocks/header';
import WordMeaningTable from '@/components/ui/word-meaning-table';
import { fetchVideoWords } from '@/app/actions/fetchVideoWords';
import { getVideoDetails } from '@/lib/videoUtils';
import { updateVideoWords } from '@/app/actions/updateVideoWords';  
import { useNotionIntegration } from '@/lib/notionIntegration';
import { useToast } from "@/hooks/use-toast";

export default function VideoPage({ params }: { params: { videoId: string } }) {
  const [video, setVideo] = useState<any>(null);
  const [wordMeanings, setWordMeanings] = useState<any[]>([]);
  const [exportContent, setExportContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const { isConnected, isExporting, initiateNotionAuth, exportToNotion } = useNotionIntegration(exportContent);

  useEffect(() => {
    async function loadData() {
      try {
        const videoDetails = await getVideoDetails(params.videoId);
        if (!videoDetails) {
          setError('Video not found');
          return;
        }
        setVideo(videoDetails);

        const { wordMeanings: fetchedWordMeanings } = await fetchVideoWords(params.videoId);
        setWordMeanings(fetchedWordMeanings);

        const content = fetchedWordMeanings.map(wm => `${wm.word}: ${wm.meaning}`).join('\n');
        setExportContent(content);
      } catch (err) {
        setError('Error loading video information. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [params.videoId]);

  const handleSave = async () => {
    try {
      await updateVideoWords(params.videoId, wordMeanings);  
      toast({
        title: "Success 👍",
        description: "Saved successfully!",
      });
    } catch (error) {
      console.error("Error saving word meanings:", error);
      toast({
        title: "Error 🚨",
        description: "Failed to save. Please try again.",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className='text-red-400'>{error}</div>;
  }

  return (
    <main className="container mx-auto px-4">
      <Header 
        title={video.title} 
        isConnected={isConnected}
        isExporting={isExporting}
        onConnectNotion={initiateNotionAuth}
        onExportToNotion={exportToNotion}
        onSave={handleSave} 
      />
      <WordMeaningTable 
        wordMeanings={wordMeanings} 
        onWordMeaningsChange={setWordMeanings}  
      />
    </main>
  );
}
