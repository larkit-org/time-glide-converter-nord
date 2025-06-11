
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
    <div className="min-h-screen bg-gradient-to-br from-violet-500 to-purple-600 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Current Timestamp Card */}
        <Card className="bg-white shadow-2xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-400 to-pink-500 pb-6">
            <CardTitle className="flex items-center gap-3 text-white text-2xl font-bold">
              <Clock className="h-8 w-8" />
              Current Timestamp
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8">
                <div className="text-5xl font-mono text-cyan-400 font-bold tracking-wider">
                  {currentTimestamp}
                </div>
                <div className="text-lg text-slate-400 mt-3 font-medium">Unix Timestamp</div>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={() => copyToClipboard(currentTimestamp.toString(), 'Current timestamp')}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-xl text-lg px-8 py-3 font-bold"
                >
                  <Copy className="h-5 w-5 mr-3" />
                  Copy
                </Button>
                <Button
                  onClick={() => adjustTimestamp(-1)}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-xl text-lg px-6 py-3 font-bold"
                >
                  <Minus className="h-5 w-5 mr-2" />
                  -1h
                </Button>
                <Button
                  onClick={() => adjustTimestamp(1)}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-xl text-lg px-6 py-3 font-bold"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  +1h
                </Button>
                <Button
                  onClick={resetToNow}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-xl text-lg px-6 py-3 font-bold"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timezone Conversion */}
        <Card className="bg-white shadow-2xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 pb-6">
            <CardTitle className="text-white text-2xl font-bold">Timezone Conversion</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid gap-6">
              <div>
                <Label htmlFor="timezone" className="text-slate-800 font-bold text-lg">Select Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="mt-2 text-lg p-4 font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz} className="text-lg">{tz}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl p-6">
                <div className="text-lg text-slate-700 mb-2 font-bold">Date in {timezone}</div>
                <div className="text-2xl font-mono text-slate-900 font-bold mb-4">
                  {formatDate(currentTimestamp, timezone)}
                </div>
                <Button
                  onClick={() => copyToClipboard(formatDate(currentTimestamp, timezone), `Date in ${timezone}`)}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg text-lg px-6 py-3 font-bold"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Date
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Conversion */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Date to Timestamp */}
          <Card className="bg-white shadow-2xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500 pb-6">
              <CardTitle className="text-white text-2xl font-bold">Date to Timestamp</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div>
                <Label htmlFor="custom-date" className="text-slate-800 font-bold text-lg">Enter Date</Label>
                <Input
                  id="custom-date"
                  type="datetime-local"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="mt-2 text-lg p-4 font-medium"
                />
              </div>
              <Button
                onClick={convertDateToTimestamp}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-xl text-lg py-4 font-bold"
                disabled={!customDate}
              >
                Convert to Timestamp
              </Button>
              {customTimestamp && (
                <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl p-6">
                  <div className="text-lg text-slate-700 mb-2 font-bold">Timestamp</div>
                  <div className="font-mono text-slate-900 font-bold text-xl mb-4">{customTimestamp}</div>
                  <Button
                    onClick={() => copyToClipboard(customTimestamp, 'Converted timestamp')}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg text-lg px-6 py-3 font-bold"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timestamp to Date */}
          <Card className="bg-white shadow-2xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 pb-6">
              <CardTitle className="text-white text-2xl font-bold">Timestamp to Date</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div>
                <Label htmlFor="custom-timestamp" className="text-slate-800 font-bold text-lg">Enter Timestamp</Label>
                <Input
                  id="custom-timestamp"
                  type="number"
                  placeholder="1699123200"
                  value={customTimestamp}
                  onChange={(e) => setCustomTimestamp(e.target.value)}
                  className="mt-2 font-mono text-lg p-4 font-medium"
                />
              </div>
              {customTimestamp && !isNaN(Number(customTimestamp)) && (
                <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl p-6">
                  <div className="text-lg text-slate-700 mb-2 font-bold">Converted Date (UTC)</div>
                  <div className="font-mono text-slate-900 font-bold text-xl mb-4">
                    {formatDate(Number(customTimestamp), 'UTC')}
                  </div>
                  <Button
                    onClick={() => copyToClipboard(formatDate(Number(customTimestamp), 'UTC'), 'Converted date')}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg text-lg px-6 py-3 font-bold"
                  >
                    <Copy className="h-4 w-4 mr-2" />
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
