import React, { useState } from 'react';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified: Date;
  icon: string;
}

interface Folder {
  name: string;
  path: string;
  items: FileItem[];
}

const fileSystem: Record<string, Folder> = {
  '/': {
    name: 'Root',
    path: '/',
    items: [
      { name: 'home', type: 'folder', modified: new Date(), icon: '🏠' },
      { name: 'usr', type: 'folder', modified: new Date(), icon: '📁' },
      { name: 'etc', type: 'folder', modified: new Date(), icon: '⚙️' },
      { name: 'var', type: 'folder', modified: new Date(), icon: '📊' },
      { name: 'tmp', type: 'folder', modified: new Date(), icon: '🗂️' }
    ]
  },
  '/home': {
    name: 'Home',
    path: '/home',
    items: [
      { name: 'limitless-user', type: 'folder', modified: new Date(), icon: '👤' }
    ]
  },
  '/home/limitless-user': {
    name: 'User Home',
    path: '/home/limitless-user',
    items: [
      { name: 'Documents', type: 'folder', modified: new Date(), icon: '📄' },
      { name: 'Downloads', type: 'folder', modified: new Date(), icon: '📥' },
      { name: 'Desktop', type: 'folder', modified: new Date(), icon: '🖥️' },
      { name: 'Pictures', type: 'folder', modified: new Date(), icon: '🖼️' },
      { name: 'Videos', type: 'folder', modified: new Date(), icon: '🎬' },
      { name: '.config', type: 'folder', modified: new Date(), icon: '⚙️' },
      { name: 'README.txt', type: 'file', size: 1024, modified: new Date(), icon: '📝' }
    ]
  },
  '/home/limitless-user/Documents': {
    name: 'Documents',
    path: '/home/limitless-user/Documents',
    items: [
      { name: 'LimitlessOS_Manual.pdf', type: 'file', size: 2048576, modified: new Date(), icon: '📕' },
      { name: 'Notes.txt', type: 'file', size: 512, modified: new Date(), icon: '📝' },
      { name: 'Projects', type: 'folder', modified: new Date(), icon: '💼' }
    ]
  }
};

export const FileExplorer: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/home/limitless-user');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  
  const currentFolder = fileSystem[currentPath];
  const pathSegments = currentPath.split('/').filter(Boolean);

  const navigateToParent = () => {
    if (currentPath === '/') return;
    const parentPath = '/' + pathSegments.slice(0, -1).join('/');
    setCurrentPath(parentPath === '/' ? '/' : parentPath);
    setSelectedItem(null);
  };

  const navigateToFolder = (folderName: string) => {
    const newPath = currentPath === '/' ? `/${folderName}` : `${currentPath}/${folderName}`;
    if (fileSystem[newPath]) {
      setCurrentPath(newPath);
      setSelectedItem(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-full bg-os-dark text-os-bright flex flex-col">
      {/* Header */}
      <div className="bg-os-medium border-b border-os-light/20 p-4">
        <div className="flex items-center space-x-2 mb-2">
          <button
            onClick={navigateToParent}
            disabled={currentPath === '/'}
            className="px-3 py-1 bg-os-dark hover:bg-os-light/20 rounded text-sm border border-os-light/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Back
          </button>
          <span className="text-infinity-primary">📁</span>
          <span className="font-medium">Navigator</span>
        </div>
        
        {/* Breadcrumb */}
        <div className="flex items-center space-x-1 text-sm text-os-light">
          <button 
            onClick={() => setCurrentPath('/')}
            className="hover:text-os-bright transition-colors"
          >
            Root
          </button>
          {pathSegments.map((segment, index) => (
            <React.Fragment key={index}>
              <span>/</span>
              <button
                onClick={() => setCurrentPath('/' + pathSegments.slice(0, index + 1).join('/'))}
                className="hover:text-os-bright transition-colors"
              >
                {segment}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        {currentFolder ? (
          <div className="p-4 space-y-1">
            {currentFolder.items.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedItem(item.name);
                  if (item.type === 'folder') {
                    navigateToFolder(item.name);
                  }
                }}
                className={`
                  flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors
                  ${selectedItem === item.name ? 'bg-infinity-primary/20 border border-infinity-primary/50' : 'hover:bg-os-medium/50'}
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-os-bright truncate">
                    {item.name}
                  </div>
                  <div className="text-xs text-os-light">
                    {item.type === 'file' && item.size && formatFileSize(item.size)} · {formatDate(item.modified)}
                  </div>
                </div>
                {item.type === 'folder' && (
                  <span className="text-os-light text-sm">→</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-os-light">
            <div className="text-center">
              <div className="text-4xl mb-2">❌</div>
              <div>Folder not found</div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-os-medium border-t border-os-light/20 px-4 py-2 text-xs text-os-light">
        {currentFolder ? (
          <div className="flex justify-between">
            <span>{currentFolder.items.length} items</span>
            <span>{currentFolder.path}</span>
          </div>
        ) : (
          <span>Ready</span>
        )}
      </div>
    </div>
  );
};