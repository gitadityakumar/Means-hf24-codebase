import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from 'next/navigation';

export function useNotionIntegration(content: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const storedConnected = localStorage.getItem('notionConnected');
    if (storedConnected === 'true') {
      setIsConnected(true);
    }

    const authSuccess = searchParams.get('notion_auth_success');
    if (authSuccess === 'true') {
      setIsConnected(true);
      localStorage.setItem('notionConnected', 'true');
      toast({
        title: "Success",
        description: "Successfully connected to Notion!",
      });
      // Remove the query parameter
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [searchParams, toast, router]);

  const initiateNotionAuth = async () => {
    try {
      const currentPageUrl = encodeURIComponent(window.location.href);
      const response = await fetch(`/api/notionauth?returnUrl=${currentPageUrl}`);
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No authorization URL received');
      }
    } catch (error) {
      console.error('Error starting Notion authentication:', error);
      toast({
        title: "Error",
        description: "Failed to start Notion authentication. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportToNotion = async () => {
    if (!isConnected) {
      initiateNotionAuth();
      return;
    }

    setIsExporting(true);
    try {
      const response = await fetch('/api/notionexport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      toast({
        title: "Success 👍",
        description: "Export to Notion was successful!",
      });
    } catch (error) {
      console.error('Error exporting to Notion:', error);
      if (error instanceof Error && error.message.includes('401')) {
        toast({
          title: "Authentication Error",
          description: "Please reconnect your Notion account.",
          variant: "destructive",
        });
        setIsConnected(false);
        localStorage.removeItem('notionConnected');
      } else {
        toast({
          title: "Error 😞",
          description: "Failed to export to Notion. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsExporting(false);
    }
  };

  return { isConnected, isExporting, initiateNotionAuth, exportToNotion };
}