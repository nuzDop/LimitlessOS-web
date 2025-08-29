import React, { useState } from 'react';
import { Taskbar } from './Taskbar';
import { WindowManager } from './WindowManager';
import { AppLauncher } from './AppLauncher';
import { Terminal } from './apps/Terminal';
import { FileExplorer } from './apps/FileExplorer';
import { Settings } from './apps/Settings';
import { Firefox } from './apps/Firefox';
import { Calculator } from './apps/Calculator';
import { TextEditor } from './apps/TextEditor';
import { DesktopIcon } from './DesktopIcon';
import { ContextMenu } from './ContextMenu';
import { ActivitiesOverview } from './ActivitiesOverview';
import { SystemTray } from './SystemTray';
import infinityWallpaper from '@/assets/infinity-wallpaper.jpg';

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
    id: 'calculator',
    name: 'Calculator',
    icon: '🧮',
    component: Calculator
  },
  {
    id: 'text-editor',
    name: 'Text Editor',
    icon: '📝',
    component: TextEditor
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
  const [showActivities, setShowActivities] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [nextZIndex, setNextZIndex] = useState(100);

  // Desktop icons positions
  const [desktopIcons] = useState([
    { app: apps[0], position: { x: 50, y: 50 } },
    { app: apps[1], position: { x: 50, y: 150 } },
    { app: apps[2], position: { x: 50, y: 250 } },
    { app: apps[3], position: { x: 50, y: 350 } },
    { app: apps[4], position: { x: 50, y: 450 } },
    { app: apps[5], position: { x: 150, y: 50 } },
  ]);

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

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleContextAction = (action: string) => {
    console.log('Context action:', action);
    // Handle context menu actions
    switch (action) {
      case 'new-folder':
        console.log('Creating new folder...');
        break;
      case 'refresh':
        console.log('Refreshing desktop...');
        break;
      case 'wallpaper':
        console.log('Changing wallpaper...');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleDesktopClick = () => {
    setContextMenu(null);
    setShowActivities(false);
  };

  return (
    <div 
      className="h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${infinityWallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
    >
      {/* Desktop Icons */}
      {desktopIcons.map((item, index) => (
        <DesktopIcon
          key={index}
          app={item.app}
          position={item.position}
          onDoubleClick={openApp}
        />
      ))}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          position={contextMenu}
          onClose={() => setContextMenu(null)}
          onAction={handleContextAction}
        />
      )}

      {/* Activities Overview */}
      {showActivities && (
        <ActivitiesOverview
          apps={apps}
          onAppSelect={openApp}
          onClose={() => setShowActivities(false)}
        />
      )}

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

      {/* Taskbar with Activities button */}
      <Taskbar
        windows={windows}
        onWindowSelect={focusWindow}
        onLauncherToggle={() => setShowLauncher(!showLauncher)}
        onActivitiesToggle={() => setShowActivities(!showActivities)}
        showActivities={showActivities}
      />
    </div>
  );
};