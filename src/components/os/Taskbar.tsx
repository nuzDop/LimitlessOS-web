import React from 'react';
import { Window } from './Desktop';
import { LayoutGrid } from 'lucide-react';
import { SystemTray } from './SystemTray';

interface TaskbarProps {
  windows: Window[];
  onWindowSelect: (id: string) => void;
  onLauncherToggle: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  onWindowSelect,
  onLauncherToggle
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 os-window z-50">
      <div className="flex items-center h-full px-4">
        <button
          onClick={onLauncherToggle}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-os-medium/50 hover:bg-os-medium os-button transition-all duration-300"
        >
          <LayoutGrid className="w-5 h-5 text-os-light" />
        </button>

        <div className="flex items-center ml-4 space-x-2">
          {windows.filter(w => !w.minimized).map(window => (
            <button
              key={window.id}
              onClick={() => onWindowSelect(window.id)}
              className="px-3 py-1 text-sm bg-os-medium hover:bg-os-light/20 rounded transition-all duration-200 text-os-bright border border-os-medium/50"
            >
              {window.title}
            </button>
          ))}
        </div>

        <div className="ml-auto">
            <SystemTray />
        </div>
      </div>
    </div>
  );
};
