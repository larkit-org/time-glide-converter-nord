import React, { useState, useEffect } from 'react';
import { Copy, Plus, Minus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const TimestampConverter = () => {
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [customTimestamp, setCustomTimestamp] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [timezone, setTimezone] = useState(() => {
    return localStorage.getItem('timestamp-timezone') || 'UTC';
  });
  const { toast } = useToast();

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Stockholm',
    'Europe/Moscow',
    'Europe/Helsinki',
    'Europe/Madrid',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Beijing',
    'Australia/Sydney'
  ];

  // Auto-detect theme
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  // Save timezone to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('timestamp-timezone', timezone);
  }, [timezone]);

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
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
        className: "bg-background border-border text-foreground"
      });
    } catch (err) {
      console.error('Failed to copy:', err);
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
    <div className="min-h-screen bg-background text-foreground p-8" style={{ fontFamily: 'Montserrat, monospace' }}>
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Logo Header */}
        <div className="text-center pt-4">
          <a href="https://larkit.org/" target="_blank" rel="noopener noreferrer">
            <img 
              src="https://larkit.org/logo.png" 
              alt="Larkit" 
              className="mx-auto h-auto max-w-[100px] hover:opacity-80 transition-opacity"
              onError={(e) => {
                // Fallback to text if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden text-xl font-bold text-[#b46] hover:opacity-80 transition-opacity">Larkit</div>
          </a>
        </div>
        
        {/* Current Timestamp - Main Display */}
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <div 
              className="text-9xl font-bold tracking-tight leading-none cursor-pointer hover:text-[#b46] transition-colors"
              onClick={handleTimestampClick}
              title="Click to copy"
            >
              {currentTimestamp}
            </div>
            <div className="text-3xl text-muted-foreground font-medium tracking-wide">Unix Timestamp</div>
          </div>
          
          <div className="flex gap-6 justify-center flex-wrap">
            <Button
              onClick={() => copyToClipboard(currentTimestamp.toString(), 'Current timestamp')}
              className="bg-foreground hover:bg-[#b46] text-background text-xl px-10 py-4 rounded-none transition-colors"
            >
              <Copy className="h-6 w-6 mr-3" />
              Copy
            </Button>
            <Button
              onClick={() => adjustTimestamp(-1)}
              className="bg-muted-foreground hover:bg-[#b46] text-background text-xl px-8 py-4 rounded-none transition-colors"
            >
              <Minus className="h-6 w-6 mr-3" />
              1h
            </Button>
            <Button
              onClick={() => adjustTimestamp(1)}
              className="bg-muted-foreground hover:bg-[#b46] text-background text-xl px-8 py-4 rounded-none transition-colors"
            >
              <Plus className="h-6 w-6 mr-3" />
              1h
            </Button>
            <Button
              onClick={resetToNow}
              className="bg-muted hover:bg-[#b46] text-foreground text-xl px-8 py-4 rounded-none transition-colors"
            >
              <RefreshCw className="h-6 w-6 mr-3" />
              Now
            </Button>
          </div>
        </div>

        
        {/* Current Date in Selected Timezone */}
        <div className="text-center space-y-8 py-12 border-t border-border">
          <div className="space-y-6">
            <div className="text-5xl font-bold">
              {formatDate(currentTimestamp, timezone)}
            </div>
            <div className="flex justify-center">
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="w-80 text-xl border-2 border-foreground rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz} className="text-xl">{tz}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={() => copyToClipboard(formatDate(currentTimestamp, timezone), `Date in ${timezone}`)}
            className="bg-foreground hover:bg-[#b46] text-background text-xl px-10 py-4 rounded-none transition-colors"
          >
            <Copy className="h-6 w-6 mr-3" />
            Copy Date
          </Button>
        </div>

        {/* Conversion Tools */}
        <div className="grid md:grid-cols-2 gap-16 pt-12 border-t border-border">
          
          {/* Date to Timestamp */}
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-center">Date → Timestamp</h3>
            <div className="space-y-6">
              <Input
                type="datetime-local"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="text-xl p-6 border-2 border-foreground rounded-none"
              />
              <Button
                onClick={convertDateToTimestamp}
                className="w-full bg-muted-foreground hover:bg-[#b46] text-background text-xl py-6 rounded-none transition-colors"
                disabled={!customDate}
              >
                Convert to Timestamp
              </Button>
              {customTimestamp && (
                <div className="text-center space-y-4 p-8 bg-muted border-2 border-foreground">
                  <div className="text-4xl font-bold">{customTimestamp}</div>
                  <Button
                    onClick={() => copyToClipboard(customTimestamp, 'Converted timestamp')}
                    className="bg-foreground hover:bg-[#b46] text-background text-lg rounded-none transition-colors"
                    >
                    <Copy className="h-5 w-5 mr-2" />
                    Copy
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Timestamp to Date */}
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-center">Timestamp → Date</h3>
            <div className="space-y-6">
              <Input
                type="number"
                placeholder="Enter timestamp..."
                value={customTimestamp}
                onChange={(e) => setCustomTimestamp(e.target.value)}
                className="text-xl p-6 border-2 border-foreground rounded-none"
              />
              {customTimestamp && !isNaN(Number(customTimestamp)) && (
                <div className="text-center space-y-4 p-8 bg-muted border-2 border-foreground">
                  <div className="text-3xl font-bold">
                    {formatDate(Number(customTimestamp), 'UTC')}
                  </div>
                  <div className="text-lg text-muted-foreground">UTC</div>
                  <Button
                    onClick={() => copyToClipboard(formatDate(Number(customTimestamp), 'UTC'), 'Converted date')}
                    className="bg-foreground hover:bg-[#b46] text-background text-lg rounded-none transition-colors"
                  >
                    <Copy className="h-5 w-5 mr-2" />
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

export default TimestampConverter;
