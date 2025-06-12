import React from 'react';
import { useSound } from '../hooks/use-sound';
import logoWhite from '../assets/logo-lark-white.png';
import logoBlack from '../assets/lark-logo-black.png';

const Logo = () => {
  const { play } = useSound();

  return (
    <div 
      className="cursor-pointer hover:animate-shake" 
      onClick={() => play()}
    >
      <img 
        src={logoBlack}
        alt="LarkIT"
        className="h-12 w-auto block dark:hidden"
      />
      <img 
        src={logoWhite}
        alt="LarkIT"
        className="h-12 w-auto hidden dark:block"
      />
    </div>
  );
};

export default Logo; 