import React, { useRef, useState } from 'react';
import { Window } from './Desktop';

interface WindowManagerProps {
  windows: Window[];
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Window>) => void;
}

interface WindowComponentProps {
  window: Window;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onUpdate: (updates: Partial<Window>) => void;
}

const WindowComponent: React.FC<WindowComponentProps> = ({
  window,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdate
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('window-title')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - window.x,
        y: e.clientY - window.y
      });
      onFocus();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !window.maximized) {
      onUpdate({
        x: e.clientX - dragStart.x,
        y: Math.max(0, e.clientY - dragStart.y)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  if (window.minimized) return null;

  const windowStyle = window.maximized
    ? { left: 0, top: 0, width: '100%', height: 'calc(100% - 48px)' }
    : {
        left: window.x,
        top: window.y,
        width: window.width,
        height: window.height
      };

  return (
    <div
      ref={windowRef}
      className="absolute os-window rounded-lg overflow-hidden select-none"
      style={{
        ...windowStyle,
        zIndex: window.zIndex
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Window Title Bar */}
      <div className="window-title flex items-center justify-between h-8 bg-os-medium border-b border-os-light/20 px-3 cursor-move">
        <span className="text-sm text-os-bright truncate">{window.title}</span>
        
        {/* Window Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onMinimize}
            className="w-3 h-3 rounded-full bg-warning hover:bg-warning/80 transition-colors"
          />
          <button
            onClick={onMaximize}
            className="w-3 h-3 rounded-full bg-success hover:bg-success/80 transition-colors"
          />
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-error hover:bg-error/80 transition-colors"
          />
        </div>
      </div>

      {/* Window Content */}
      <div className="h-[calc(100%-32px)] bg-os-dark/80 backdrop-blur-sm overflow-hidden">
        {window.component}
      </div>
    </div>
  );
};

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
      {windows
        .sort((a, b) => a.zIndex - b.zIndex)
        .map(window => (
          <WindowComponent
            key={window.id}
            window={window}
            onClose={() => onClose(window.id)}
            onMinimize={() => onMinimize(window.id)}
            onMaximize={() => onMaximize(window.id)}
            onFocus={() => onFocus(window.id)}
            onUpdate={(updates) => onUpdate(window.id, updates)}
          />
        ))}
    </>
  );
};