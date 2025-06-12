
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
  const [timezone, setTimezone] = useState('UTC');
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

  // Update current timestamp every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
        className: "bg-green-50 border-green-200 text-green-800"
      });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const adjustTimestamp = (hours: number) => {
    const adjusted = currentTimestamp + (hours * 3600);
    setCurrentTimestamp(adjusted);
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
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Current Timestamp - Main Display */}
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="text-8xl font-mono font-bold text-gray-900 tracking-tight">
              {currentTimestamp}
            </div>
            <div className="text-2xl text-gray-600 font-medium">Unix Timestamp</div>
          </div>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={() => copyToClipboard(currentTimestamp.toString(), 'Current timestamp')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3"
            >
              <Copy className="h-5 w-5 mr-2" />
              Copy
            </Button>
            <Button
              onClick={() => adjustTimestamp(-1)}
              className="bg-red-600 hover:bg-red-700 text-white text-lg px-6 py-3"
            >
              <Minus className="h-5 w-5 mr-2" />
              -1h
            </Button>
            <Button
              onClick={() => adjustTimestamp(1)}
              className="bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-3"
            >
              <Plus className="h-5 w-5 mr-2" />
              +1h
            </Button>
            <Button
              onClick={resetToNow}
              className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-6 py-3"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Now
            </Button>
          </div>
        </div>

        {/* Current Date in Selected Timezone */}
        <div className="text-center space-y-6 py-8 border-t border-gray-200">
          <div className="space-y-4">
            <div className="text-4xl font-mono font-bold text-gray-900">
              {formatDate(currentTimestamp, timezone)}
            </div>
            <div className="flex justify-center">
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="w-64 text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz} className="text-lg">{tz}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={() => copyToClipboard(formatDate(currentTimestamp, timezone), `Date in ${timezone}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3"
          >
            <Copy className="h-5 w-5 mr-2" />
            Copy Date
          </Button>
        </div>

        {/* Conversion Tools */}
        <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-gray-200">
          
          {/* Date to Timestamp */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 text-center">Date → Timestamp</h3>
            <div className="space-y-4">
              <Input
                type="datetime-local"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="text-lg p-4"
              />
              <Button
                onClick={convertDateToTimestamp}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-4"
                disabled={!customDate}
              >
                Convert to Timestamp
              </Button>
              {customTimestamp && (
                <div className="text-center space-y-3 p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-mono font-bold text-gray-900">{customTimestamp}</div>
                  <Button
                    onClick={() => copyToClipboard(customTimestamp, 'Converted timestamp')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Timestamp to Date */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 text-center">Timestamp → Date</h3>
            <div className="space-y-4">
              <Input
                type="number"
                placeholder="Enter timestamp..."
                value={customTimestamp}
                onChange={(e) => setCustomTimestamp(e.target.value)}
                className="font-mono text-lg p-4"
              />
              {customTimestamp && !isNaN(Number(customTimestamp)) && (
                <div className="text-center space-y-3 p-6 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-mono font-bold text-gray-900">
                    {formatDate(Number(customTimestamp), 'UTC')}
                  </div>
                  <div className="text-sm text-gray-600">UTC</div>
                  <Button
                    onClick={() => copyToClipboard(formatDate(Number(customTimestamp), 'UTC'), 'Converted date')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Copy className="h-4 w-4 mr-2" />
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
