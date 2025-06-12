import { useState, useEffect, useRef } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Copy, Minus, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useSound } from '../hooks/use-sound';
import logoWhite from '../assets/logo-lark-white.png';
import logoBlack from '../assets/lark-logo-black.png';
import { timezones } from '../lib/timezones';

const TimestampConverter = () => {
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [customTimestamp, setCustomTimestamp] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [timezone1, setTimezone1] = useState(() => {
    return localStorage.getItem('timestamp-timezone-1') || 'UTC';
  });
  const [timezone2, setTimezone2] = useState(() => {
    return localStorage.getItem('timestamp-timezone-2') || 'Europe/Moscow';
  });
  const { play: playLarkSound } = useSound('/sounds/lark.mp3');
  const audioRef = useRef<HTMLAudioElement>(null);

  // Auto-detect theme
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  // Save timezones to localStorage when they change
  useEffect(() => {
    localStorage.setItem('timestamp-timezone-1', timezone1);
    localStorage.setItem('timestamp-timezone-2', timezone2);
  }, [timezone1, timezone2]);

  const formatDate = (timestamp: number, tz: string = 'UTC') => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!", {
        description: `${label} copied to clipboard`
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error("Failed to copy", {
        description: "Please try again"
      });
    }
  };

  const adjustTimestamp = (hours: number) => {
    setCurrentTimestamp(prev => prev + (hours * 3600));
  };

  const convertDateToTimestamp = () => {
    if (customDate) {
      const timestamp = Math.floor(new Date(customDate).getTime() / 1000);
      setCustomTimestamp(timestamp.toString());
    }
  };

  const resetToNow = () => {
    setCurrentTimestamp(Math.floor(Date.now() / 1000));
  };

  const handleTimestampClick = () => {
    copyToClipboard(currentTimestamp.toString(), 'Timestamp');
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8" style={{ fontFamily: 'Montserrat, monospace' }}>
      <div className="max-w-4xl mx-auto space-y-8 md:space-y-16">
        
        {/* Logo Header */}
        <div className="text-center pt-4">
          <a 
            href="https://larkit.org/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="logo-shake inline-block"
            onClick={(e) => {
              e.preventDefault();
              playLarkSound();
              window.open('https://larkit.org/', '_blank', 'noopener,noreferrer');
            }}
          >
            <img 
              src={logoBlack}
              alt="LarkIT" 
              className="mx-auto h-12 w-auto block dark:hidden hover:opacity-80 transition-opacity cursor-pointer"
            />
            <img 
              src={logoWhite}
              alt="LarkIT" 
              className="mx-auto h-12 w-auto hidden dark:block hover:opacity-80 transition-opacity cursor-pointer"
            />
          </a>
        </div>
        
        {/* Current Timestamp - Main Display */}
        <div className="text-center space-y-6 md:space-y-8">
          <div className="space-y-4 md:space-y-6">
            <div 
              className="text-5xl md:text-9xl font-bold tracking-tight leading-none cursor-pointer hover:text-[#b46] transition-colors"
              onClick={handleTimestampClick}
              title="Click to copy"
            >
              {currentTimestamp}
            </div>
            <div className="text-xl md:text-3xl text-muted-foreground font-medium tracking-wide">Unix Timestamp</div>
          </div>
          
          <div className="flex gap-2 md:gap-6 justify-center flex-wrap">
            <Button
              onClick={() => copyToClipboard(currentTimestamp.toString(), 'Current timestamp')}
              className="bg-foreground hover:bg-[#b46] text-background text-base md:text-xl px-4 md:px-10 py-2 md:py-4 rounded-none transition-colors"
            >
              <Copy className="h-4 w-4 md:h-6 md:w-6 mr-2 md:mr-3" />
              Copy
            </Button>
            <Button
              onClick={() => adjustTimestamp(-1)}
              className="bg-muted-foreground hover:bg-[#b46] text-background text-base md:text-xl px-4 md:px-8 py-2 md:py-4 rounded-none transition-colors"
            >
              <Minus className="h-4 w-4 md:h-6 md:w-6 mr-2 md:mr-3" />
              1h
            </Button>
            <Button
              onClick={() => adjustTimestamp(1)}
              className="bg-muted-foreground hover:bg-[#b46] text-background text-base md:text-xl px-4 md:px-8 py-2 md:py-4 rounded-none transition-colors"
            >
              <Plus className="h-4 w-4 md:h-6 md:w-6 mr-2 md:mr-3" />
              1h
            </Button>
            <Button
              onClick={resetToNow}
              className="bg-muted hover:bg-[#b46] text-foreground text-base md:text-xl px-4 md:px-8 py-2 md:py-4 rounded-none transition-colors"
            >
              <RefreshCw className="h-4 w-4 md:h-6 md:w-6 mr-2 md:mr-3" />
              Now
            </Button>
          </div>
        </div>

        {/* Current Date in Selected Timezones */}
        <div className="text-center space-y-6 md:space-y-8 py-8 md:py-12 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* First Timezone */}
            <div className="space-y-4 md:space-y-6">
              <div className="text-3xl md:text-5xl font-bold break-words">
                {formatDate(currentTimestamp, timezone1)}
              </div>
              <div className="flex justify-center px-4">
                <Select value={timezone1} onValueChange={setTimezone1}>
                  <SelectTrigger className="w-full md:w-80 text-base md:text-xl border-2 border-foreground rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz} className="text-base md:text-xl">{tz}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => copyToClipboard(formatDate(currentTimestamp, timezone1), `Date in ${timezone1}`)}
                className="bg-foreground hover:bg-[#b46] text-background text-base md:text-xl px-6 md:px-10 py-2 md:py-4 rounded-none transition-colors"
              >
                <Copy className="h-4 w-4 md:h-6 md:w-6 mr-2 md:mr-3" />
                Copy Date
              </Button>
            </div>

            {/* Second Timezone */}
            <div className="space-y-4 md:space-y-6">
              <div className="text-3xl md:text-5xl font-bold break-words">
                {formatDate(currentTimestamp, timezone2)}
              </div>
              <div className="flex justify-center px-4">
                <Select value={timezone2} onValueChange={setTimezone2}>
                  <SelectTrigger className="w-full md:w-80 text-base md:text-xl border-2 border-foreground rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz} className="text-base md:text-xl">{tz}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => copyToClipboard(formatDate(currentTimestamp, timezone2), `Date in ${timezone2}`)}
                className="bg-foreground hover:bg-[#b46] text-background text-base md:text-xl px-6 md:px-10 py-2 md:py-4 rounded-none transition-colors"
              >
                <Copy className="h-4 w-4 md:h-6 md:w-6 mr-2 md:mr-3" />
                Copy Date
              </Button>
            </div>
          </div>

          {/* Time Difference */}
          <div className="text-center text-muted-foreground text-base md:text-lg">
            Time difference: {calculateTimeDifference(currentTimestamp, timezone1, timezone2)}
          </div>
        </div>

        {/* Conversion Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 pt-8 md:pt-12 border-t border-border">
          
          {/* Date to Timestamp */}
          <div className="space-y-6 md:space-y-8">
            <h3 className="text-2xl md:text-3xl font-bold text-center">Date → Timestamp</h3>
            <div className="space-y-4 md:space-y-6">
              <Input
                type="datetime-local"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="text-base md:text-xl p-4 md:p-6 border-2 border-foreground rounded-none"
              />
              <Button
                onClick={convertDateToTimestamp}
                className="w-full bg-muted-foreground hover:bg-[#b46] text-background text-base md:text-xl py-4 md:py-6 rounded-none transition-colors"
                disabled={!customDate}
              >
                Convert to Timestamp
              </Button>
              {customTimestamp && (
                <div className="text-center space-y-4 p-6 md:p-8 bg-muted border-2 border-foreground">
                  <div className="text-2xl md:text-4xl font-bold break-words">{customTimestamp}</div>
                  <Button
                    onClick={() => copyToClipboard(customTimestamp, 'Converted timestamp')}
                    className="bg-foreground hover:bg-[#b46] text-background text-base md:text-lg rounded-none transition-colors"
                  >
                    <Copy className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                    Copy
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Timestamp to Date */}
          <div className="space-y-6 md:space-y-8">
            <h3 className="text-2xl md:text-3xl font-bold text-center">Timestamp → Date</h3>
            <div className="space-y-4 md:space-y-6">
              <Input
                type="number"
                placeholder="Enter timestamp..."
                value={customTimestamp}
                onChange={(e) => setCustomTimestamp(e.target.value)}
                className="text-base md:text-xl p-4 md:p-6 border-2 border-foreground rounded-none"
              />
              {customTimestamp && !isNaN(Number(customTimestamp)) && (
                <div className="text-center space-y-4 p-6 md:p-8 bg-muted border-2 border-foreground">
                  <div className="text-xl md:text-3xl font-bold break-words">
                    {formatDate(Number(customTimestamp), 'UTC')}
                  </div>
                  <div className="text-base md:text-lg text-muted-foreground">UTC</div>
                  <Button
                    onClick={() => copyToClipboard(formatDate(Number(customTimestamp), 'UTC'), 'Converted date')}
                    className="bg-foreground hover:bg-[#b46] text-background text-base md:text-lg rounded-none transition-colors"
                  >
                    <Copy className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                    Copy
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate time difference between timezones
const calculateTimeDifference = (timestamp: number, tz1: string, tz2: string) => {
  const date = new Date(timestamp * 1000);
  
  // Get the time parts for both timezones
  const [time1, period1] = date.toLocaleTimeString('en-US', { 
    timeZone: tz1,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }).split(':').map(Number);

  const [time2, period2] = date.toLocaleTimeString('en-US', {
    timeZone: tz2,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }).split(':').map(Number);

  // Calculate difference in hours and minutes
  let hourDiff = time1 - time2;
  
  // Handle cases where the difference crosses the day boundary
  if (hourDiff > 12) {
    hourDiff = hourDiff - 24;
  } else if (hourDiff < -12) {
    hourDiff = hourDiff + 24;
  }

  const sign = hourDiff >= 0 ? '+' : '';
  return `${sign}${hourDiff}:00`;
};

export default TimestampConverter;
