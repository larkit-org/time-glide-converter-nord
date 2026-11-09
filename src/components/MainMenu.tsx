import React from 'react';
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const MainMenu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-background border-2 border-foreground shadow-lg hover:bg-accent hover:text-accent-foreground"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Additional Features</SheetTitle>
        </SheetHeader>
        <div className="py-6">
          <nav className="flex flex-col space-y-4">
            <a
              href="https://larkit.org/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm hover:text-primary transition-colors"
            >
              <span>Blog</span>
            </a>
            <a
              href="https://github.com/larkit-org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm hover:text-primary transition-colors"
            >
              <span>GitHub</span>
            </a>
            <a
              href="https://larkit.org/donate"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm hover:text-primary transition-colors"
            >
              <span>Support Us</span>
            </a>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MainMenu; 