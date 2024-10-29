"use client"
import React from 'react';
import { Button } from "@/components/ui/button";
import { IconBrandYoutube, IconBrain, IconBrandNotion, IconBrowserPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation'



const LandingPage = () => {
  const router = useRouter();
  const handleSignupButton = () => {
    router.push('/sign-up');
  };
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-8">
          <nav className="flex justify-between items-center">
            <div className="w-32">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" className="w-full h-auto">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor:"#3b82f6", stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:"#8b5cf6", stopOpacity:1}} />
                  </linearGradient>
                </defs>
                <rect width="200" height="60" fill="none"/>
                <text x="10" y="45" fontFamily="Arial, sans-serif" fontSize="40" fontWeight="bold" fill="url(#gradient)">Means</text>
                <path d="M185 10 L190 15 L185 20" stroke="url(#gradient)" strokeWidth="3" fill="none"/>
                <path d="M180 10 L185 15 L180 20" stroke="url(#gradient)" strokeWidth="3" fill="none"/>
              </svg>
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
      <Button variant="ghost" className="hidden sm:inline-flex">Features</Button>
      <Button variant="ghost" className="hidden sm:inline-flex">Contact</Button>
      <Button 
        className="px-6 py-2 bg-transparent text-white border border-purple-500 rounded-md transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-purple-600 hover:text-white hover:border-transparent hover:shadow-neon" 
        onClick={handleSignupButton}
      >
        Sign Up
      </Button>
    </div>
          </nav>
        </header>

        <main className="mt-16">
          <div className="text-center">
            <h2 className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Enhance Your YouTube Experience
            </h2>
            <p className="text-xl mb-12 max-w-2xl mx-auto text-gray-300">
              Record, process, and export YouTube video content with our powerful Chrome extension and AI-driven platform.
              Seamlessly integrate with your browser and leverage the power of Gemini AI.
            </p>
            <Button className="px-8 py-4 text-lg bg-transparent text-white border-2 border-blue-500 rounded-md transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-blue-600 hover:text-white hover:border-transparent hover:shadow-neon">
              Get Started
            </Button>
          </div>

          <div className="mt-24 relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-black text-lg font-medium text-gray-400">
                Powerful Features
              </span>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 ">
            <FeatureCard
              icon={<IconBrowserPlus size={32} />}
              title="Chrome Extension"
              description="One-click recording of YouTube videos with our seamless browser integration."
            />
            <FeatureCard
              icon={<IconBrain size={32} />}
              title="AI-Powered Analysis"
              description="Process videos using Gemini AI to extract meaningful content and insights."
            />
            <FeatureCard
              icon={<IconBrandYoutube size={32} />}
              title="Video History"
              description="Access and manage all your recorded videos in one place for easy processing."
            />
            <FeatureCard
              icon={<IconBrandNotion size={32} />}
              title="Notion Export"
              description="Export processed video content directly to your Notion workspace for seamless integration."
            />
          </div>
        </main>

        <footer className="mt-24 pb-8 text-center text-gray-400 border-t border-gray-800 pt-8">
          <p>&copy; 2024 Means. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};
//@ts-ignore
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="relative  p-6 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors duration-300">
      <div className="absolute -inset-px bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true"></div>
      <div className="relative flex flex-col h-full">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-900 rounded-full mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm flex-grow">{description}</p>
      </div>
    </div>
  );
};

export default LandingPage;