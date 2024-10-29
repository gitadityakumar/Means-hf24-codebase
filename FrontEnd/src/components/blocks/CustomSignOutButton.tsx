import React from 'react';
import { signOut } from '@/app/actions/signOut';

const CustomSignOutButton = () => {

  function Signout(){
    signOut();
  }
  
  return (
      <button className="flex items-center space-x-3 text-sm font-sans text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white">
        <span onClick={Signout}>Logout</span>
      </button>
  );
};

export default CustomSignOutButton;