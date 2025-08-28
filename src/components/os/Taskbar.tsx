import React from 'react';
import { Window } from './Desktop';

interface TaskbarProps {
  windows: Window[];
  onWindowSelect: (id: string) => void;
  onLauncherToggle: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  onWindowSelect,
  onLauncherToggle
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 os-window border-t border-os-medium z-50">
      <div className="flex items-center h-full px-4">
        {/* Infinity Logo / App Launcher */}
        <button
          onClick={onLauncherToggle}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-infinity-primary to-infinity-secondary os-button hover:shadow-[0_0_20px_hsl(var(--infinity-glow)/0.5)] transition-all duration-300"
        >
          <svg viewBox="0 0 200 100" className="w-5 h-3">
            <path
              d="M50 50C50 22 72 0 100 0s50 22 50 50-22 50-50 50-22-22 0-50 22-50 50-50 50 22 50 50-22 50-50 50-50-22-50-50z"
              fill="none"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Window List */}
        <div className="flex items-center ml-4 space-x-2">
          {windows.filter(w => !w.minimized).map(window => (
            <button
              key={window.id}
              onClick={() => onWindowSelect(window.id)}
              className="px-3 py-1 text-sm bg-os-medium hover:bg-os-light/20 rounded transition-all duration-200 text-os-bright border border-os-medium/50"
            >
              {window.title}
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div className="ml-auto flex items-center space-x-4">
          {/* System Status */}
          <div className="flex items-center space-x-2 text-xs text-os-light">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>Online</span>
          </div>
          
          {/* Clock */}
          <div className="text-sm text-os-bright font-mono">
            {new Date().toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};