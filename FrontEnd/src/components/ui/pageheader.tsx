
import React, { useEffect, useState } from 'react';
import { modeState } from '@/app/recoilContextProvider';
import { useRecoilState } from 'recoil';
import CustomComponent from './customComponent';
import { getUser } from '@/app/actions/getUser';
import { User } from 'lucide-react';

interface PageHeaderProps {
  onProcess: () => Promise<void>;
  isProcessing: boolean;
  progress: number | null;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onProcess, isProcessing, progress }) => {
  const [mode] = useRecoilState(modeState);
  const [userData, setUserData] = useState({ name: '', userId: '' });

  useEffect(() => {
    async function fetchUserData() {
      const data = await getUser();
      setUserData(data);
    }

    fetchUserData();
  }, []);

  return (
    <header className="bg-zinc-100 bg-opacity-20 backdrop-filter backdrop-blur-lg border border-gray-200 border-opacity-20 rounded-lg shadow-lg p-4 m-2 flex flex-col md:flex-row items-center justify-between">
      <div className="flex items-center mb-4 md:mb-0">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-8 h-8 text-gray-500" />
        </div>
        <div className="ml-4">
          <h1 className="text-xl font-bold text-gray-800">
            {userData.name || 'User'}
          </h1>
          <h3 className="text-sm text-gray-600">Watch History</h3>
        </div>
      </div>
      <div className="text-gray-600 flex flex-row items-center">
        <div className="text-xl text-center font-semibold rounded-lg p-2 mr-4">
          Mode: 
          {mode === 'private' ? (
            <span className="text-teal-400 ml-2">Private</span>
          ) : (
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 ml-2">
              Public
            </span>
          )}
        </div>
        <CustomComponent
          buttonText="Process"
          onProcess={onProcess}
          isProcessing={isProcessing}
          progress={progress!}
        />
      </div>
    </header>
  );
};

export default PageHeader;