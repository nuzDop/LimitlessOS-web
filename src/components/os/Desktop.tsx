import React, { useState } from 'react';
import { Taskbar } from './Taskbar';
import { WindowManager } from './WindowManager';
import { AppLauncher } from './AppLauncher';
import { Terminal } from './apps/Terminal';
import { FileExplorer } from './apps/FileExplorer';
import { Settings } from './apps/Settings';
import { Firefox } from './apps/Firefox';

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
    id: 'firefox',
    name: 'Firefox Browser',
    icon: '🦊',
    component: Firefox
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: '⚡',
    component: Terminal
  },
  {
    id: 'navigator',
    name: 'File Explorer',
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
        {/* Infinity symbol pattern background */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-20"
              style={{
                left: `${15 + i * 12}%`,
                top: `${15 + (i % 3) * 25}%`,
                width: '100px',
                height: '50px',
                transform: `rotate(${i * 30}deg)`
              }}
            >
              <svg viewBox="0 0 200 100" className="w-full h-full">
                <path
                  d="M50,50 C30,30 10,30 10,50 C10,70 30,70 50,50 C70,30 130,30 150,50 C170,70 190,70 190,50 C190,30 170,30 150,50 C130,70 70,70 50,50 Z"
                  fill="none"
                  stroke="hsl(var(--infinity-primary))"
                  strokeWidth="2"
                  opacity="0.6"
                />
              </svg>
            </div>
          ))}
          
          {/* Large central infinity symbol */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <svg viewBox="0 0 400 200" className="w-96 h-48">
              <path
                d="M100,100 C60,60 20,60 20,100 C20,140 60,140 100,100 C140,60 260,60 300,100 C340,140 380,140 380,100 C380,60 340,60 300,100 C260,140 140,140 100,100 Z"
                fill="none"
                stroke="hsl(var(--infinity-secondary))"
                strokeWidth="3"
                opacity="0.8"
              />
            </svg>
          </div>
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