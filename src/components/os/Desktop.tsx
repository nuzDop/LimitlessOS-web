import React, { useState, useCallback } from 'react';
import { Taskbar } from './Taskbar';
import { WindowManager } from './WindowManager';
import { AppLauncher } from './AppLauncher';
import { DesktopIcon } from './DesktopIcon';
import { ContextMenu } from './ContextMenu';
import { vfs } from '@/lib/vfs';
import { Terminal } from './apps/Terminal';
import { FileExplorer } from './apps/FileExplorer';
import { Settings } from './apps/Settings';
import { Browser } from './apps/Browser';
import { Calculator } from './apps/Calculator';
import { TextEditor } from './apps/TextEditor';
import wallpaper from '@/assets/infinity-wallpaper.jpg';

// Interfaces for Window and App remain the same

const apps: App[] = [
    { id: 'browser', name: 'Browser', icon: '🦊', component: Browser },
    { id: 'terminal', name: 'Terminal', icon: '⚡', component: Terminal },
    { id: 'navigator', name: 'Navigator', icon: '📁', component: FileExplorer },
    { id: 'settings', name: 'Settings', icon: '⚙️', component: Settings },
    { id: 'calculator', name: 'Calculator', icon: '🧮', component: Calculator },
    { id: 'editor', name: 'Text Editor', icon: '📝', component: TextEditor },
];

export const Desktop: React.FC = () => {
  const [windows, setWindows] = useState<Window[]>([]);
  const [showLauncher, setShowLauncher] = useState(false);
  const [nextZIndex, setNextZIndex] = useState(100);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number} | null>(null);

  const openApp = useCallback((app: App, props: object = {}) => {
    const id = `${app.id}-${Date.now()}`; // Allow multiple instances
    const newWindow: Window = {
      id,
      title: app.name,
      component: React.createElement(app.component, props),
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

  // All window management functions (closeWindow, etc.) remain the same

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
      {/* Background Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${wallpaper})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* UI Layer */}
      <div className="relative z-10 h-full w-full">
        <div className="absolute top-4 left-4 flex flex-col gap-2">
            {apps.map(app => <DesktopIcon key={app.id} app={app} onOpen={openApp} />)}
        </div>

        <WindowManager
          windows={windows}
          onClose={(id) => setWindows(prev => prev.filter(w => w.id !== id))}
          onMinimize={(id) => setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: true } : w))}
          onMaximize={(id) => setWindows(prev => prev.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w))}
          onFocus={(id) => {
              setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: false, zIndex: nextZIndex } : w));
              setNextZIndex(prev => prev + 1);
          }}
          onUpdate={(id, updates) => setWindows(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w))}
        />
        {showLauncher && <AppLauncher apps={apps} onAppSelect={openApp} onClose={() => setShowLauncher(false)} />}
        {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={closeContextMenu} actions={contextMenuActions} />}
        <Taskbar
          windows={windows}
          onWindowSelect={(id) => {
              setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: false, zIndex: nextZIndex } : w));
              setNextZIndex(prev => prev + 1);
          }}
          onLauncherToggle={() => setShowLauncher(!showLauncher)}
        />
      </div>
    </div>
  );
};
