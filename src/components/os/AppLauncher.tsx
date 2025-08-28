import React, { useEffect, useRef } from 'react';
import { App } from './Desktop';

interface AppLauncherProps {
  apps: App[];
  onAppSelect: (app: App) => void;
  onClose: () => void;
}

export const AppLauncher: React.FC<AppLauncherProps> = ({
  apps,
  onAppSelect,
  onClose
}) => {
  const launcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (launcherRef.current && !launcherRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-os-void/50 backdrop-blur-sm z-40 flex items-center justify-center">
      <div
        ref={launcherRef}
        className="os-window rounded-2xl p-8 min-w-[400px] animate-[bootFade_0.3s_ease-out]"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-infinity-primary to-infinity-secondary bg-clip-text text-transparent mb-2">
            LimitlessOS
          </h2>
          <p className="text-os-light text-sm">Choose an application</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {apps.map(app => (
            <button
              key={app.id}
              onClick={() => onAppSelect(app)}
              className="flex flex-col items-center p-4 rounded-xl bg-os-medium/50 hover:bg-os-medium border border-os-light/20 hover:border-infinity-primary/50 transition-all duration-300 os-button group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                {app.icon}
              </div>
              <span className="text-os-bright text-sm font-medium">{app.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-os-light hover:text-os-bright text-sm transition-colors"
          >
            Press ESC or click outside to close
          </button>
        </div>
      </div>
    </div>
  );
};