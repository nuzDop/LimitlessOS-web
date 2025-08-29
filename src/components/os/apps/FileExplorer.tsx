import React, { useState, useEffect } from 'react';
import { vfs } from '@/lib/vfs';
import { App } from '../Desktop';

import folderIcon from '@/assets/icons/folder.svg';
import fileTextIcon from '@/assets/icons/file-text.svg';
import fileImageIcon from '@/assets/icons/file-image.svg';
import filePdfIcon from '@/assets/icons/file-pdf.svg';
import fileGenericIcon from '@/assets/icons/file-generic.svg';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  modified: string;
}

// Define the props the File Explorer will accept
interface FileExplorerProps {
  openApp: (app: App, props: object) => void;
  apps: App[];
}

const getIconForFile = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'txt':
        case 'md':
            return fileTextIcon;
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'svg':
            return fileImageIcon;
        case 'pdf':
            return filePdfIcon;
        default:
            return fileGenericIcon;
    }
};

export const FileExplorer: React.FC<FileExplorerProps> = ({ openApp, apps }) => {
  const [currentPath, setCurrentPath] = useState('/home/limitless-user');
  const [items, setItems] = useState<FileItem[]>([]);
  
  const loadItems = () => {
    const dirContents = vfs.readDir(currentPath);
    if (dirContents) {
      const mappedItems = Object.entries(dirContents).map(([name, data]) => ({
        name,
        type: data.type,
        modified: data.modified,
      }));
      setItems(mappedItems);
    } else {
      setItems([]);
    }
  };

  useEffect(() => {
    loadItems();
  }, [currentPath]);

  const navigateTo = (folderName: string) => {
    const newPath = currentPath === '/' ? `/${folderName}` : `${currentPath}/${folderName}`;
    if (vfs.readDir(newPath)) {
        setCurrentPath(newPath);
    }
  };

  const navigateUp = () => {
    if (currentPath === '/') return;
    const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/')) || '/';
    setCurrentPath(parentPath);
  };
  
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const handleDoubleClick = (item: FileItem) => {
    if (item.type === 'folder') {
      navigateTo(item.name);
    } else if (item.name.endsWith('.txt')) {
      // Find the text editor app and open it with the file path
      const editorApp = apps.find(a => a.id === 'editor');
      if (editorApp) {
        const fullPath = currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}`;
        openApp(editorApp, { filePath: fullPath });
      }
    }
  };

  return (
    <div className="h-full bg-os-dark text-os-bright flex flex-col">
      <div className="bg-os-medium border-b border-os-light/20 p-2 flex items-center space-x-2">
        <button onClick={navigateUp} disabled={currentPath === '/'} className="px-3 py-1 bg-os-dark hover:bg-os-light/20 rounded disabled:opacity-50">
          ↑ Up
        </button>
        <div className="text-sm text-os-light bg-os-dark px-3 py-1 rounded w-full font-mono">{currentPath}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-1 gap-1">
          {items.length === 0 && (
            <div className="text-center text-os-light p-8">This folder is empty.</div>
          )}
          {items.map((item) => (
            <div
              key={item.name}
              onDoubleClick={() => handleDoubleClick(item)}
              className="flex items-center space-x-3 p-2 rounded cursor-pointer hover:bg-os-medium/50"
              title={item.name}
            >
              <img 
                src={item.type === 'folder' ? folderIcon : getIconForFile(item.name)} 
                alt={item.type} 
                className="w-6 h-6"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-os-bright truncate">{item.name}</div>
              </div>
              <div className="text-xs text-os-light font-mono">{formatDate(item.modified)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
