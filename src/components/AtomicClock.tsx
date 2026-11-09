import React, { useEffect, useState } from 'react';
import { GlobeIcon } from "@radix-ui/react-icons";

const AtomicClock = () => {
  const [time, setTime] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    const syncWithServer = async () => {
      try {
        const response = await fetch('https://worldtimeapi.org/api/ip');
        const data = await response.json();
        const serverTime = new Date(data.datetime).getTime();
        const localTime = Date.now();
        setOffset(serverTime - localTime);
      } catch (error) {
        console.error('Error syncing with server:', error);
      }
    };

    // Синхронизируемся с сервером при загрузке
    syncWithServer();
    
    // И затем каждые 5 минут
    const syncInterval = setInterval(syncWithServer, 5 * 60 * 1000);

    // Обновляем локальное время каждую секунду
    const tickInterval = setInterval(() => {
      const now = new Date(Date.now() + offset);
      setTime(now.toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(syncInterval);
      clearInterval(tickInterval);
    };
  }, [offset]);

  return (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
      <GlobeIcon className="w-4 h-4" />
      <span>{time}</span>
    </div>
  );
};

export default AtomicClock; 