import React, { useState } from 'react';
import { Taskbar } from './Taskbar';
import { WindowManager } from './WindowManager';
import { AppLauncher } from './AppLauncher';
import { Terminal } from './apps/Terminal';
import { FileExplorer } from './apps/FileExplorer';
import { Settings } from './apps/Settings';

export interface Window {
  id: string;
  title: string;
  component: React.ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
}

export interface App {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType;
}

const apps: App[] = [
  {
    id: 'terminal',
    name: 'Terminal',
    icon: '⚡',
    component: Terminal
  },
  {
    id: 'navigator',
    name: 'Navigator',
    icon: '📁',
    component: FileExplorer
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: '⚙️',
    component: Settings
  }
];

export const Desktop: React.FC = () => {
  const [windows, setWindows] = useState<Window[]>([]);
  const [showLauncher, setShowLauncher] = useState(false);
  const [nextZIndex, setNextZIndex] = useState(100);

  const openApp = (app: App) => {
    const existing = windows.find(w => w.id === app.id && !w.minimized);
    if (existing) {
      focusWindow(existing.id);
      return;
    }

    const newWindow: Window = {
      id: app.id,
      title: app.name,
      component: <app.component />,
      x: Math.random() * 200 + 100,
      y: Math.random() * 100 + 100,
      width: 800,
      height: 600,
      minimized: false,
      maximized: false,
      zIndex: nextZIndex
    };

    setWindows(prev => [...prev.filter(w => w.id !== app.id), newWindow]);
    setNextZIndex(prev => prev + 1);
    setShowLauncher(false);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev =>
      prev.map(w => w.id === id ? { ...w, minimized: true } : w)
    );
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev =>
      prev.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w)
    );
  };

  const focusWindow = (id: string) => {
    setWindows(prev =>
      prev.map(w => w.id === id 
        ? { ...w, minimized: false, zIndex: nextZIndex }
        : w
      )
    );
    setNextZIndex(prev => prev + 1);
  };

  const updateWindow = (id: string, updates: Partial<Window>) => {
    setWindows(prev =>
      prev.map(w => w.id === id ? { ...w, ...updates } : w)
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-os-void via-os-shadow to-os-dark relative overflow-hidden">
      {/* Desktop Background */}
      <div className="absolute inset-0">
        {/* Infinity pattern background */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-32 h-16 opacity-30"
              style={{
                left: `${20 + i * 25}%`,
                top: `${20 + (i % 2) * 30}%`,
                transform: `rotate(${i * 45}deg)`
              }}
            >
              <svg viewBox="0 0 200 100" className="w-full h-full">
                <path
                  d="M50 50C50 22 72 0 100 0s50 22 50 50-22 50-50 50-22-22 0-50 22-50 50-50 50 22 50 50-22 50-50 50-50-22-50-50z"
                  fill="none"
                  stroke="hsl(var(--infinity-primary))"
                  strokeWidth="1"
                  opacity="0.3"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Windows */}
      <WindowManager
        windows={windows}
        onClose={closeWindow}
        onMinimize={minimizeWindow}
        onMaximize={maximizeWindow}
        onFocus={focusWindow}
        onUpdate={updateWindow}
      />

      {/* App Launcher */}
      {showLauncher && (
        <AppLauncher
          apps={apps}
          onAppSelect={openApp}
          onClose={() => setShowLauncher(false)}
        />
      )}

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        onWindowSelect={focusWindow}
        onLauncherToggle={() => setShowLauncher(!showLauncher)}
      />
    </div>
  );
};