import React from 'react';
import { App } from './Desktop';

interface DesktopIconProps {
  app: App;
  onOpen: (app: App) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ app, onOpen }) => {
  return (
    <div 
        className="flex flex-col items-center justify-center text-center w-24 h-24 cursor-pointer p-2 rounded-lg hover:bg-white/10"
        onDoubleClick={() => onOpen(app)}
    >
      <div className="text-4xl">{app.icon}</div>
      <span className="text-white text-xs mt-2 truncate w-full">{app.name}</span>
    </div>
  );
};
