import { useState, useEffect, useRef } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Copy, Minus, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useSound } from '../hooks/use-sound';
import logoWhite from '../assets/logo-lark-white.png';
import logoBlack from '../assets/lark-logo-black.png';
import TimezonePicker from './TimezonePicker';
import { calculateTimeDifference, detectTimezone, readStoredTimezone } from '../lib/timezones';

const TimestampConverter = () => {
  const [currentTimestamp, setCurrentTimestamp] = useState(() => Math.floor(Date.now() / 1000));
  const [customTimestamp, setCustomTimestamp] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [timezone1, setTimezone1] = useState(() => readStoredTimezone('timestamp-timezone-1', detectTimezone() ?? 'UTC'));
  const [timezone2, setTimezone2] = useState(() => readStoredTimezone('timestamp-timezone-2', 'Europe/Moscow'));
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
    // Intl.DateTimeFormat throws on dates outside the range Date can represent.
    if (Number.isNaN(date.getTime())) return 'Invalid timestamp';
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
    <div className="flex flex-col items-center justify-center space-y-8 md:space-y-16">
      {/* Logo Header */}
      <div className="text-center">
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
            className="bg-foreground hover:bg-[#b46] text-background text-base md:text-xl px-4 md:px-10 py-2 md:py-4 transition-colors"
          >
            <Copy className="h-4 w-4 md:h-6 md:w-6 mr-2 md:mr-3" />
            Copy
          </Button>
          <Button
            onClick={() => adjustTimestamp(-1)}
            className="bg-muted-foreground hover:bg-[#b46] text-background text-base md:text-xl px-4 md:px-8 py-2 md:py-4 transition-colors"
          >
            <Minus className="h-4 w-4 md:h-6 md:w-6 mr-2 md:mr-3" />
            1h
          </Button>
          <Button
            onClick={() => adjustTimestamp(1)}
            className="bg-muted-foreground hover:bg-[#b46] text-background text-base md:text-xl px-4 md:px-8 py-2 md:py-4 transition-colors"
          >
            <Plus className="h-4 w-4 md:h-6 md:w-6 mr-2 md:mr-3" />
            1h
          </Button>
          <Button
            onClick={resetToNow}
            className="bg-muted hover:bg-[#b46] text-foreground text-base md:text-xl px-4 md:px-8 py-2 md:py-4 transition-colors"
          >
            <RefreshCw className="h-4 w-4 md:h-6 md:w-6 mr-2 md:mr-3" />
            Now
          </Button>
        </div>
      </div>

      {/* Current Date in Selected Timezones */}
      <div className="text-center space-y-6 md:space-y-8 py-8 md:py-12 border-t border-border w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* First Timezone */}
          <div className="space-y-4 md:space-y-6">
            <div className="text-3xl md:text-5xl font-bold wrap-break-word">
              {formatDate(currentTimestamp, timezone1)}
            </div>
            <TimezonePicker value={timezone1} onChange={setTimezone1} />
            <Button
              onClick={() => copyToClipboard(formatDate(currentTimestamp, timezone1), `Date in ${timezone1}`)}
              className="bg-foreground hover:bg-[#b46] text-background text-base md:text-xl px-6 md:px-10 py-2 md:py-4 transition-colors"
            >
              <Copy className="h-4 w-4 md:h-6 md:w-6 mr-2 md:mr-3" />
              Copy Date
            </Button>
          </div>

          {/* Second Timezone */}
          <div className="space-y-4 md:space-y-6">
            <div className="text-3xl md:text-5xl font-bold wrap-break-word">
              {formatDate(currentTimestamp, timezone2)}
            </div>
            <TimezonePicker value={timezone2} onChange={setTimezone2} />
            <Button
              onClick={() => copyToClipboard(formatDate(currentTimestamp, timezone2), `Date in ${timezone2}`)}
              className="bg-foreground hover:bg-[#b46] text-background text-base md:text-xl px-6 md:px-10 py-2 md:py-4 transition-colors"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 pt-8 md:pt-12 border-t border-border w-full">
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
              className="w-full bg-muted-foreground hover:bg-[#b46] text-background text-base md:text-xl py-4 md:py-6 transition-colors"
              disabled={!customDate}
            >
              Convert to Timestamp
            </Button>
            {customTimestamp && (
              <div className="text-center space-y-4 p-6 md:p-8 bg-muted border-2 border-foreground">
                <div className="text-2xl md:text-4xl font-bold wrap-break-word">{customTimestamp}</div>
                <Button
                  onClick={() => copyToClipboard(customTimestamp, 'Converted timestamp')}
                  className="bg-foreground hover:bg-[#b46] text-background text-base md:text-lg transition-colors"
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
              value={customTimestamp}
              onChange={(e) => setCustomTimestamp(e.target.value)}
              placeholder="Enter Unix timestamp"
              className="text-base md:text-xl p-4 md:p-6 border-2 border-foreground rounded-none"
            />
            {customTimestamp && (
              <div className="text-center space-y-4 p-6 md:p-8 bg-muted border-2 border-foreground">
                <div className="text-2xl md:text-4xl font-bold wrap-break-word">
                  {formatDate(parseInt(customTimestamp), timezone1)}
                </div>
                <Button
                  onClick={() => copyToClipboard(formatDate(parseInt(customTimestamp), timezone1), 'Converted date')}
                  className="bg-foreground hover:bg-[#b46] text-background text-base md:text-lg transition-colors"
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
  );
};

export default TimestampConverter;
