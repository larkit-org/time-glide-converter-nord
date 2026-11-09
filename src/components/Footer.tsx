import React from 'react';
import { Button } from "./ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import AtomicClock from './AtomicClock';

const Footer = () => {
  return (
    <footer className="w-full py-6 border-t">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <a 
            href="https://github.com/larkit-org/time-glide-converter-nord" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center hover:text-primary"
          >
            <GitHubLogoIcon className="w-5 h-5 mr-2" />
            LarkIT
          </a>
          <AtomicClock />
        </div>
        <Button 
          variant="default" 
          className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white"
          onClick={() => window.open('https://larkit.org/donate', '_blank')}
        >
          Donate ❤️
        </Button>
      </div>
    </footer>
  );
};

export default Footer; 