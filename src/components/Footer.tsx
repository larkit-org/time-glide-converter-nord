import React from 'react';
import { Button } from "./ui/button";
import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-6 border-t">
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <a 
            href="https://github.com/larkit-org/time-glide-converter-nord" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center hover:text-primary"
          >
            <Github className="w-5 h-5 mr-2" />
            LarkIT
          </a>
          <span>Copyleft 🄯 {new Date().getFullYear()} LarkIT</span>
        </div>
        <Button 
          variant="default" 
          className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white"
          onClick={() => window.open('https://nowpayments.io/donation/larkit', '_blank')}
        >
          Donate ❤️
        </Button>
      </div>
    </footer>
  );
};

export default Footer; 