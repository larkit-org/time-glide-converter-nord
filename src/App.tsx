import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import TimestampConverter from "./components/TimestampConverter";
import { ThemeToggle } from "./components/ui/theme-toggle";
import MainMenu from "./components/MainMenu";
import Footer from './components/Footer';
import './App.css';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <div className="min-h-screen bg-background text-foreground">
          <header className="fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <MainMenu />
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="container mx-auto px-4 pt-20">
            <TimestampConverter />
          </main>
          <Footer />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
