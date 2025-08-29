import React from 'react';
import { App } from './Desktop';

interface DesktopIconProps {
  app: App;
  onDoubleClick: (app: App) => void;
  position: { x: number; y: number };
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ app, onDoubleClick, position }) => {
  return (
    <div
      className="absolute flex flex-col items-center cursor-pointer group"
      style={{ left: position.x, top: position.y }}
      onDoubleClick={() => onDoubleClick(app)}
    >
      <div className="w-16 h-16 bg-os-medium/20 rounded-lg flex items-center justify-center mb-2 group-hover:bg-os-medium/40 transition-colors backdrop-blur-sm border border-os-light/20">
        <span className="text-2xl">{app.icon}</span>
      </div>
      <span className="text-os-bright text-xs text-center max-w-20 truncate bg-os-void/50 px-2 py-1 rounded backdrop-blur-sm">
        {app.name}
      </span>
    </div>
  );
};