import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Wifi, 
  Volume2, 
  Battery, 
  Bell,
  Settings,
  Power,
  User,
  Calendar,
  Clock
} from 'lucide-react';

export const SystemTray: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(2);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex items-center space-x-2 text-os-bright">
      {/* System Icons */}
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Wifi className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Volume2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
          <Battery className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 text-xs">85%</span>
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
          <Bell className="h-4 w-4" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-infinity-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </Button>
      </div>

      {/* Date and Time */}
      <div className="flex flex-col items-end text-xs px-2">
        <div className="font-mono">{formatTime(currentTime)}</div>
        <div className="text-os-light text-[10px]">{formatDate(currentTime)}</div>
      </div>

      {/* User Menu */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-full"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <User className="h-4 w-4" />
        </Button>
        
        {showUserMenu && (
          <div className="absolute right-0 bottom-full mb-2 bg-os-dark/95 backdrop-blur-md border border-os-medium rounded-lg shadow-lg py-2 min-w-48">
            <div className="px-4 py-2 border-b border-os-medium/50">
              <div className="text-sm font-medium text-os-bright">limitless-user</div>
              <div className="text-xs text-os-light">Administrator</div>
            </div>
            <button className="w-full px-4 py-2 text-left text-os-bright hover:bg-os-medium/50 flex items-center space-x-3">
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </button>
            <button className="w-full px-4 py-2 text-left text-os-bright hover:bg-os-medium/50 flex items-center space-x-3">
              <Power className="w-4 h-4" />
              <span className="text-sm">Power Off</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};