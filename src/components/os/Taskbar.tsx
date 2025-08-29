import React from 'react';
import { Button } from '@/components/ui/button';
import { Window } from './Desktop';
import { SystemTray } from './SystemTray';

interface TaskbarProps {
  windows: Window[];
  onWindowSelect: (id: string) => void;
  onLauncherToggle: () => void;
  onActivitiesToggle: () => void;
  showActivities: boolean;
}

export const Taskbar: React.FC<TaskbarProps> = ({ 
  windows, 
  onWindowSelect, 
  onLauncherToggle,
  onActivitiesToggle,
  showActivities
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-os-dark/80 backdrop-blur-md border-t border-os-medium/50 flex items-center px-4 z-30">
      {/* Activities Button */}
      <Button
        variant={showActivities ? "default" : "ghost"}
        size="sm"
        onClick={onActivitiesToggle}
        className="mr-4 font-semibold"
      >
        Activities
      </Button>

      {/* App Launcher */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onLauncherToggle}
        className="mr-4"
      >
        <span className="text-lg">🚀</span>
      </Button>

      {/* Window Tabs */}
      <div className="flex-1 flex items-center space-x-2 overflow-x-auto">
        {windows.filter(w => !w.minimized).map(window => (
          <Button
            key={window.id}
            variant="ghost"
            size="sm"
            onClick={() => onWindowSelect(window.id)}
            className="flex items-center space-x-2 max-w-48 truncate"
          >
            <span className="truncate">{window.title}</span>
          </Button>
        ))}
      </div>

      {/* System Tray */}
      <SystemTray />
    </div>
  );
};