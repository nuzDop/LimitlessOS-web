import React from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  actions: {
    label: string;
    action: () => void;
  }[];
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, actions }) => {
  return (
    <div 
      className="fixed z-[1000] os-window rounded-md p-1"
      style={{ top: y, left: x }}
    >
      <ul className="text-sm text-os-bright">
        {actions.map(({ label, action }) => (
          <li 
            key={label}
            className="px-3 py-1.5 hover:bg-professional-primary rounded cursor-pointer"
            onClick={() => { action(); onClose(); }}
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
};
