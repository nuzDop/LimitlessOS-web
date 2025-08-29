import React, { useState, useEffect } from 'react';
import { vfs } from '@/lib/vfs';

interface TextEditorProps {
  filePath?: string;
}

export const TextEditor: React.FC<TextEditorProps> = ({ filePath }) => {
  const [content, setContent] = useState("");
  const [currentFile, setCurrentFile] = useState(filePath);

  useEffect(() => {
    if (currentFile) {
      const fileContent = vfs.readFile(currentFile);
      if (fileContent !== null) {
        setContent(fileContent);
      }
    }
  }, [currentFile]);

  const handleSave = () => {
    if (currentFile) {
      vfs.delete(currentFile);
      vfs.create(currentFile, 'file', content);
      alert('File saved!');
    } else {
        const newFilePath = prompt("Save as (e.g., /home/limitless-user/new.txt):");
        if (newFilePath && vfs.create(newFilePath, 'file', content)) {
            setCurrentFile(newFilePath);
            alert('File saved!');
        } else {
            alert('Could not save file. Path might be invalid or file already exists.');
        }
    }
  };

  return (
    <div className="h-full bg-os-shadow text-os-bright flex flex-col">
      <div className="bg-os-dark p-2 flex justify-between items-center border-b border-os-medium">
        <span className="text-sm font-mono">{currentFile || 'Untitled'}</span>
        <button onClick={handleSave} className="px-3 py-1 bg-professional-primary text-white text-xs rounded hover:bg-opacity-80">Save</button>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-full bg-os-shadow text-os-bright font-mono p-4 outline-none resize-none"
        placeholder="Start typing..."
      />
    </div>
  );
};
