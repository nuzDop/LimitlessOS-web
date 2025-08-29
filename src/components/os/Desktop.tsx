import React, { useState, useCallback } from 'react';
import { Taskbar } from './Taskbar';
import { WindowManager } from './WindowManager';
import { AppLauncher } from './AppLauncher';
import { DesktopIcon } from './DesktopIcon';
import { ContextMenu } from './ContextMenu';
import { ActivitiesOverview } from './ActivitiesOverview';
import { vfs } from '@/lib/vfs';
import { Terminal } from './apps/Terminal';
import { FileExplorer } from './apps/FileExplorer';
import { Settings } from './apps/Settings';
import { Browser } from './apps/Browser';
import { Calculator } from './apps/Calculator';
import { TextEditor } from './apps/TextEditor';
import browserIcon from '@/assets/icons/browser.svg';
import terminalIcon from '@/assets/icons/terminal.svg';
import explorerIcon from '@/assets/icons/explorer.svg';
import settingsIcon from '@/assets/icons/settings.svg';
import calculatorIcon from '@/assets/icons/calculator.svg';
import editorIcon from '@/assets/icons/editor.svg';
import wallpaper from '@/assets/infinity-wallpaper.jpg';

export interface Window {
  id: string;
  title: string;
  icon: string;
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
  component: React.ComponentType<any>;
}

const apps: App[] = [
    { id: 'browser', name: 'Browser', icon: browserIcon, component: Browser },
    { id: 'terminal', name: 'Terminal', icon: terminalIcon, component: Terminal },
    { id: 'navigator', name: 'Navigator', icon: explorerIcon, component: FileExplorer },
    { id: 'editor', name: 'Text Editor', icon: editorIcon, component: TextEditor },
    { id: 'calculator', name: 'Calculator', icon: calculatorIcon, component: Calculator },
    { id: 'settings', name: 'Settings', icon: settingsIcon, component: Settings },
];

// Create a separate list for apps that should appear on the desktop
const desktopApps = apps.filter(app => app.id !== 'calculator');

export const Desktop: React.FC = () => {
  const [windows, setWindows] = useState<Window[]>([]);
  const [showLauncher, setShowLauncher] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const [nextZIndex, setNextZIndex] = useState(100);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number} | null>(null);

  const openApp = useCallback((app: App, props: object = {}) => {
    const id = `${app.id}-${Date.now()}`;
    const newWindow: Window = {
      id,
      title: app.name,
      icon: app.icon,
      component: React.createElement(app.component, { ...props, openApp, apps }),
      x: Math.random() * 200 + 50,
      y: Math.random() * 100 + 50,
      width: app.id === 'browser' ? 1024 : 800,
      height: app.id === 'browser' ? 768 : 600,
      minimized: false,
      maximized: false,
      zIndex: nextZIndex
    };
    setWindows(prev => [...prev, newWindow]);
    setNextZIndex(prev => prev + 1);
    setShowLauncher(false);
  }, [nextZIndex]);

  const focusWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: false, zIndex: nextZIndex } : w));
    setNextZIndex(prev => prev + 1);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => setContextMenu(null);

  const contextMenuActions = [
    { label: "New Folder", action: () => {
        const name = prompt("Enter folder name:");
        if (name) vfs.create(`/home/limitless-user/${name}`, 'folder');
    }},
    { label: "New Text File", action: () => openApp(apps.find(app => app.id === 'editor')!) }
  ];

  return (
    <div className="h-screen relative overflow-hidden" onContextMenu={handleContextMenu} onClick={closeContextMenu}>
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${wallpaper})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 h-full w-full">
        <div className="absolute top-4 left-4 flex flex-col gap-2">
            {/* Map over the filtered desktopApps list here */}
            {desktopApps.map(app => <DesktopIcon key={app.id} app={app} onOpen={openApp} />)}
        </div>

        <WindowManager
          windows={windows}
          onClose={(id) => setWindows(prev => prev.filter(w => w.id !== id))}
          onMinimize={(id) => setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: true } : w))}
          onMaximize={(id) => setWindows(prev => prev.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w))}
          onFocus={focusWindow}
          onUpdate={(id, updates) => setWindows(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w))}
        />
        {/* The launcher still uses the full 'apps' list */}
        {showLauncher && <AppLauncher apps={apps} onAppSelect={openApp} onClose={() => setShowLauncher(false)} />}
        {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={closeContextMenu} actions={contextMenuActions} />}
        {showActivities && <ActivitiesOverview windows={windows} onWindowSelect={focusWindow} onClose={() => setShowActivities(false)} />}
        <Taskbar
          windows={windows}
          onWindowSelect={focusWindow}
          onLauncherToggle={() => setShowLauncher(!showLauncher)}
          onActivitiesToggle={() => setShowActivities(!showActivities)}
        />
      </div>
    </div>
  );
};
