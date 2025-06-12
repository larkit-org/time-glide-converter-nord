import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import TimestampConverter from "./components/TimestampConverter";
import { ThemeToggle } from "./components/ui/theme-toggle";
import Footer from './components/Footer';
import './App.css';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <>
                <div className="min-h-screen flex flex-col">
                  <div className="flex-grow">
                    <div className="container mx-auto p-4">
                      <div className="flex justify-end mb-8">
                        <ThemeToggle />
                      </div>
                      <TimestampConverter />
                    </div>
                  </div>
                  <Footer />
                </div>
              </>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
