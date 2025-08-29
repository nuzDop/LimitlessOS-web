import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';

export const SystemTray: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2 text-xs text-os-light">
        <Wifi size={16} />
        <Battery size={16} />
      </div>
      <div className="text-sm text-os-bright font-mono">
        {time.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })}
      </div>
    </div>
  );
};
