
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
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney'
  ];

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
        title: "Скопировано!",
        description: `${label} скопировано в буфер обмена`,
        className: "bg-gray-50 border-gray-200 text-gray-900"
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

  return (
    <div className="min-h-screen bg-white p-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Current Timestamp - Main Display */}
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <div className="text-9xl font-bold text-black tracking-tight leading-none">
              {currentTimestamp}
            </div>
            <div className="text-3xl text-gray-600 font-medium tracking-wide">Unix Timestamp</div>
          </div>
          
          <div className="flex gap-6 justify-center flex-wrap">
            <Button
              onClick={() => copyToClipboard(currentTimestamp.toString(), 'Текущий timestamp')}
              className="bg-black hover:bg-gray-800 text-white text-xl px-10 py-4 rounded-none font-mono"
            >
              <Copy className="h-6 w-6 mr-3" />
              Copy
            </Button>
            <Button
              onClick={() => adjustTimestamp(-1)}
              className="bg-gray-900 hover:bg-gray-700 text-white text-xl px-8 py-4 rounded-none font-mono"
            >
              <Minus className="h-6 w-6 mr-3" />
              -1h
            </Button>
            <Button
              onClick={() => adjustTimestamp(1)}
              className="bg-gray-900 hover:bg-gray-700 text-white text-xl px-8 py-4 rounded-none font-mono"
            >
              <Plus className="h-6 w-6 mr-3" />
              +1h
            </Button>
            <Button
              onClick={resetToNow}
              className="bg-gray-800 hover:bg-gray-600 text-white text-xl px-8 py-4 rounded-none font-mono"
            >
              <RefreshCw className="h-6 w-6 mr-3" />
              Now
            </Button>
          </div>
        </div>

        {/* Current Date in Selected Timezone */}
        <div className="text-center space-y-8 py-12 border-t border-gray-300">
          <div className="space-y-6">
            <div className="text-5xl font-bold text-black font-mono">
              {formatDate(currentTimestamp, timezone)}
            </div>
            <div className="flex justify-center">
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="w-80 text-xl border-2 border-black rounded-none font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="font-mono">
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz} className="text-xl">{tz}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={() => copyToClipboard(formatDate(currentTimestamp, timezone), `Дата в ${timezone}`)}
            className="bg-black hover:bg-gray-800 text-white text-xl px-10 py-4 rounded-none font-mono"
          >
            <Copy className="h-6 w-6 mr-3" />
            Copy Date
          </Button>
        </div>

        {/* Conversion Tools */}
        <div className="grid md:grid-cols-2 gap-16 pt-12 border-t border-gray-300">
          
          {/* Date to Timestamp */}
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-black text-center font-mono">Date → Timestamp</h3>
            <div className="space-y-6">
              <Input
                type="datetime-local"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="text-xl p-6 border-2 border-black rounded-none font-mono"
              />
              <Button
                onClick={convertDateToTimestamp}
                className="w-full bg-gray-900 hover:bg-gray-700 text-white text-xl py-6 rounded-none font-mono"
                disabled={!customDate}
              >
                Convert to Timestamp
              </Button>
              {customTimestamp && (
                <div className="text-center space-y-4 p-8 bg-gray-100 border-2 border-black">
                  <div className="text-4xl font-bold text-black font-mono">{customTimestamp}</div>
                  <Button
                    onClick={() => copyToClipboard(customTimestamp, 'Конвертированный timestamp')}
                    className="bg-black hover:bg-gray-800 text-white text-lg rounded-none font-mono"
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
            <h3 className="text-3xl font-bold text-black text-center font-mono">Timestamp → Date</h3>
            <div className="space-y-6">
              <Input
                type="number"
                placeholder="Enter timestamp..."
                value={customTimestamp}
                onChange={(e) => setCustomTimestamp(e.target.value)}
                className="text-xl p-6 border-2 border-black rounded-none font-mono"
              />
              {customTimestamp && !isNaN(Number(customTimestamp)) && (
                <div className="text-center space-y-4 p-8 bg-gray-100 border-2 border-black">
                  <div className="text-3xl font-bold text-black font-mono">
                    {formatDate(Number(customTimestamp), 'UTC')}
                  </div>
                  <div className="text-lg text-gray-600 font-mono">UTC</div>
                  <Button
                    onClick={() => copyToClipboard(formatDate(Number(customTimestamp), 'UTC'), 'Конвертированная дата')}
                    className="bg-black hover:bg-gray-800 text-white text-lg rounded-none font-mono"
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
