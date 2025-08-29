import React from 'react';
import Draggable from 'react-draggable';
import { Window } from './Desktop';
import { Minus, Square, X } from 'lucide-react';

interface WindowManagerProps {
  windows: Window[];
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Window>) => void;
}

export const WindowManager: React.FC<WindowManagerProps> = ({
  windows,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdate
}) => {
  return (
    <>
      {windows.filter(w => !w.minimized).map(window => (
        <Draggable
          key={window.id}
          handle=".title-bar"
          position={window.maximized ? { x: 0, y: 0 } : { x: window.x, y: window.y }}
          onStop={(_, data) => onUpdate(window.id, { x: data.x, y: data.y })}
          bounds="parent"
        >
          <div
            className={`os-window rounded-lg flex flex-col absolute ${window.maximized ? 'w-full h-full' : ''}`}
            style={{ width: window.maximized ? '100%' : window.width, height: window.maximized ? '100%' : window.height, zIndex: window.zIndex }}
            onMouseDown={() => onFocus(window.id)}
          >
            <div className="title-bar h-8 bg-os-medium flex items-center px-2 rounded-t-lg cursor-move">
              {/* Add the app icon to the title bar */}
              <img src={window.icon} alt="" className="w-4 h-4 mr-2" />
              <span className="text-sm text-os-bright flex-1 truncate">{window.title}</span>
              <div className="flex items-center space-x-2">
                <button onClick={() => onMinimize(window.id)} className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-os-light/20"><Minus size={12} /></button>
                <button onClick={() => onMaximize(window.id)} className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-os-light/20"><Square size={10} /></button>
                <button onClick={() => onClose(window.id)} className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-500"><X size={12} /></button>
              </div>
            </div>
            <div className="flex-1 bg-os-dark rounded-b-lg overflow-hidden">
              {window.component}
            </div>
          </div>
        </Draggable>
      ))}
    </>
  );
};
