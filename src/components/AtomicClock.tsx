import { useEffect, useRef, useState } from 'react';
import { GlobeIcon } from "@radix-ui/react-icons";

const SYNC_INTERVAL_MS = 5 * 60 * 1000;

const AtomicClock = () => {
  const [time, setTime] = useState<string>('');
  // Kept in a ref: as effect state, every new offset would trigger another fetch.
  const offsetRef = useRef(0);

  useEffect(() => {
    const controller = new AbortController();

    const syncWithServer = async () => {
      try {
        const response = await fetch('https://worldtimeapi.org/api/ip', { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const serverTime = new Date(data.datetime).getTime();
        if (!Number.isFinite(serverTime)) throw new Error('Invalid datetime in response');
        offsetRef.current = serverTime - Date.now();
      } catch (error) {
        if (!controller.signal.aborted) console.error('Error syncing with server:', error);
      }
    };

    syncWithServer();
    const syncInterval = setInterval(syncWithServer, SYNC_INTERVAL_MS);
    const tickInterval = setInterval(() => {
      setTime(new Date(Date.now() + offsetRef.current).toLocaleTimeString());
    }, 1000);

    return () => {
      controller.abort();
      clearInterval(syncInterval);
      clearInterval(tickInterval);
    };
  }, []);

  return (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
      <GlobeIcon className="w-4 h-4" />
      <span>{time}</span>
    </div>
  );
};

export default AtomicClock; 