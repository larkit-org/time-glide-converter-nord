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
        // Same-origin Pages Function (functions/api/time.ts): no third party, CSP stays 'self'.
        const sentAt = Date.now();
        const response = await fetch('/api/time', { signal: controller.signal, cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const receivedAt = Date.now();
        const serverTime = Number(data?.now);
        if (!Number.isFinite(serverTime)) throw new Error('Invalid time in response');
        // NTP-style: the server stamped the request roughly halfway through the round trip.
        offsetRef.current = serverTime - (sentAt + receivedAt) / 2;
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