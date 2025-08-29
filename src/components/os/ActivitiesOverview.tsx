import React from 'react';
import { Window } from './Desktop';

interface ActivitiesOverviewProps {
  windows: Window[];
  onWindowSelect: (id: string) => void;
  onClose: () => void;
}

export const ActivitiesOverview: React.FC<ActivitiesOverviewProps> = ({ windows, onWindowSelect, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-os-void/80 backdrop-blur-md z-[1000] flex items-center justify-center p-8 animate-[bootFade_0.3s_ease-out]"
      onClick={onClose}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {windows.filter(w => !w.minimized).map(window => (
          <div 
            key={window.id}
            className="w-64 h-48 os-window rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 flex flex-col"
            onClick={(e) => { e.stopPropagation(); onWindowSelect(window.id); onClose(); }}
          >
            {/* --- Corrected and more robust Title Bar --- */}
            <div className="flex-shrink-0 h-8 px-2 bg-os-medium rounded-t-lg flex items-center overflow-hidden">
              <img src={window.icon} alt={window.title} className="w-4 h-4 mr-2 flex-shrink-0" />
              <div className="flex-grow truncate text-sm text-os-bright">
                {window.title}
              </div>
            </div>
            
            <div className="flex-grow p-2 text-xs text-os-light bg-os-dark">
              Content Preview
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
