import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Save, 
  FolderOpen, 
  FileText, 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

export const TextEditor: React.FC = () => {
  const [content, setContent] = useState('Welcome to LimitlessOS Text Editor!\n\nStart typing your document here...');
  const [filename, setFilename] = useState('Untitled.txt');
  const [fontSize, setFontSize] = useState(14);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleSave = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileOpen = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setContent(e.target?.result as string);
        setFilename(file.name);
      };
      reader.readAsText(file);
    }
  };

  const formatText = (command: string) => {
    document.execCommand(command);
  };

  return (
    <div className="h-full bg-os-dark text-os-bright flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center space-x-2 p-3 border-b border-os-medium bg-os-shadow">
        {/* File Operations */}
        <div className="flex items-center space-x-2 mr-4">
          <Input
            type="file"
            accept=".txt,.md,.js,.html,.css,.json"
            onChange={handleFileOpen}
            className="hidden"
            id="file-input"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <FolderOpen className="h-4 w-4 mr-1" />
            Open
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => setContent('')}>
            <FileText className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>

        {/* File Name */}
        <div className="flex items-center space-x-2 mr-4">
          <Input
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="w-40 h-8 text-sm bg-os-dark border-os-medium"
          />
        </div>

        {/* Font Size */}
        <div className="flex items-center space-x-2 mr-4">
          <span className="text-sm">Size:</span>
          <Input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-16 h-8 text-sm bg-os-dark border-os-medium"
            min="8"
            max="72"
          />
        </div>

        {/* Statistics */}
        <div className="ml-auto text-xs text-os-light">
          Words: {content.split(/\s+/).filter(word => word.length > 0).length} | 
          Characters: {content.length} | 
          Lines: {content.split('\n').length}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full resize-none bg-os-void border-os-medium text-os-bright font-mono"
          style={{ fontSize: `${fontSize}px` }}
          placeholder="Start typing your document..."
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between p-2 border-t border-os-medium bg-os-shadow text-xs text-os-light">
        <div>LimitlessOS Text Editor</div>
        <div className="flex items-center space-x-4">
          <span>UTF-8</span>
          <span>Line: {content.substring(0, content.indexOf('\n') !== -1 ? content.indexOf('\n') : content.length).length}</span>
          <span>Column: {content.length - content.lastIndexOf('\n') - 1}</span>
        </div>
      </div>
    </div>
  );
};