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
    name: 'Command Terminal',
    icon: '⚡',
    component: Terminal
  },
  {
    id: 'navigator',
    name: 'File Navigator',
    icon: '📁',
    component: FileExplorer
  },
  {
    id: 'settings',
    name: 'System Control',
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
        {/* Military grid pattern background */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-military-primary/20"
              style={{
                left: `${10 + i * 12}%`,
                top: `${10 + (i % 3) * 25}%`,
                width: '120px',
                height: '120px',
                transform: `rotate(${i * 45}deg)`
              }}
            />
          ))}
          
          {/* Security badge pattern */}
          {[...Array(3)].map((_, i) => (
            <div
              key={`badge-${i}`}
              className="absolute w-16 h-16 opacity-20"
              style={{
                right: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
                transform: `rotate(${i * 30}deg)`
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  d="M50 10 L80 30 L80 70 C80 85 65 90 50 90 C35 90 20 85 20 70 L20 30 Z"
                  fill="none"
                  stroke="hsl(var(--military-secondary))"
                  strokeWidth="1"
                  opacity="0.4"
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