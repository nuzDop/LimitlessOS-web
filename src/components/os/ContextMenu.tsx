import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  FolderPlus, 
  FileText, 
  Image, 
  Settings, 
  RefreshCw,
  Monitor,
  Palette
} from 'lucide-react';

interface ContextMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
  onAction: (action: string) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ position, onClose, onAction }) => {
  const menuItems = [
    { icon: FolderPlus, label: 'New Folder', action: 'new-folder' },
    { icon: FileText, label: 'New Document', action: 'new-document' },
    { icon: Image, label: 'New Image', action: 'new-image' },
    { separator: true },
    { icon: RefreshCw, label: 'Refresh Desktop', action: 'refresh' },
    { icon: Monitor, label: 'Display Settings', action: 'display-settings' },
    { icon: Palette, label: 'Change Wallpaper', action: 'wallpaper' },
    { separator: true },
    { icon: Settings, label: 'Desktop Settings', action: 'desktop-settings' }
  ];

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="absolute bg-os-dark/95 backdrop-blur-md border border-os-medium rounded-lg shadow-lg py-2 min-w-48"
        style={{ left: position.x, top: position.y }}
        onClick={(e) => e.stopPropagation()}
      >
        {menuItems.map((item, index) => 
          item.separator ? (
            <hr key={index} className="my-1 border-os-medium/50" />
          ) : (
            <button
              key={index}
              className="w-full px-4 py-2 text-left text-os-bright hover:bg-os-medium/50 flex items-center space-x-3 transition-colors"
              onClick={() => {
                onAction(item.action);
                onClose();
              }}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </button>
          )
        )}
      </div>
    </div>
  );
};