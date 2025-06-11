
import React, { useState, useEffect } from 'react';
import { Copy, Plus, Minus, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        className: "bg-emerald-50 border-emerald-200 text-emerald-800"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">Timestamp Converter</h1>
          <p className="text-lg text-slate-600">Convert timestamps to dates across timezones</p>
        </div>

        {/* Current Timestamp Card */}
        <Card className="bg-white/80 backdrop-blur shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Clock className="h-5 w-5 text-blue-600" />
              Current Timestamp
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <div className="bg-slate-900 rounded-lg p-4">
                <div className="text-3xl font-mono text-emerald-400 font-bold">
                  {currentTimestamp}
                </div>
                <div className="text-sm text-slate-400 mt-1">Unix Timestamp</div>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  onClick={() => copyToClipboard(currentTimestamp.toString(), 'Current timestamp')}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  onClick={() => adjustTimestamp(-1)}
                  variant="outline"
                  className="border-red-200 hover:bg-red-50 text-red-700"
                >
                  <Minus className="h-4 w-4 mr-2" />
                  -1h
                </Button>
                <Button
                  onClick={() => adjustTimestamp(1)}
                  variant="outline"
                  className="border-emerald-200 hover:bg-emerald-50 text-emerald-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  +1h
                </Button>
                <Button
                  onClick={resetToNow}
                  variant="outline"
                  className="border-blue-200 hover:bg-blue-50 text-blue-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timezone Conversion */}
        <Card className="bg-white/80 backdrop-blur shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-slate-800">Timezone Conversion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="timezone" className="text-slate-700 font-medium">Select Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-slate-100 rounded-lg p-4">
                <div className="text-sm text-slate-600 mb-1">Date in {timezone}</div>
                <div className="text-xl font-mono text-slate-900 font-semibold">
                  {formatDate(currentTimestamp, timezone)}
                </div>
                <Button
                  onClick={() => copyToClipboard(formatDate(currentTimestamp, timezone), `Date in ${timezone}`)}
                  size="sm"
                  className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Date
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Conversion */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Date to Timestamp */}
          <Card className="bg-white/80 backdrop-blur shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-slate-800">Date to Timestamp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="custom-date" className="text-slate-700 font-medium">Enter Date</Label>
                <Input
                  id="custom-date"
                  type="datetime-local"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button
                onClick={convertDateToTimestamp}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={!customDate}
              >
                Convert to Timestamp
              </Button>
              {customTimestamp && (
                <div className="bg-slate-100 rounded-lg p-3">
                  <div className="text-sm text-slate-600 mb-1">Timestamp</div>
                  <div className="font-mono text-slate-900 font-semibold">{customTimestamp}</div>
                  <Button
                    onClick={() => copyToClipboard(customTimestamp, 'Converted timestamp')}
                    size="sm"
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timestamp to Date */}
          <Card className="bg-white/80 backdrop-blur shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-slate-800">Timestamp to Date</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="custom-timestamp" className="text-slate-700 font-medium">Enter Timestamp</Label>
                <Input
                  id="custom-timestamp"
                  type="number"
                  placeholder="1699123200"
                  value={customTimestamp}
                  onChange={(e) => setCustomTimestamp(e.target.value)}
                  className="mt-1 font-mono"
                />
              </div>
              {customTimestamp && !isNaN(Number(customTimestamp)) && (
                <div className="bg-slate-100 rounded-lg p-3">
                  <div className="text-sm text-slate-600 mb-1">Converted Date (UTC)</div>
                  <div className="font-mono text-slate-900 font-semibold">
                    {formatDate(Number(customTimestamp), 'UTC')}
                  </div>
                  <Button
                    onClick={() => copyToClipboard(formatDate(Number(customTimestamp), 'UTC'), 'Converted date')}
                    size="sm"
                    className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TimestampConverter;
