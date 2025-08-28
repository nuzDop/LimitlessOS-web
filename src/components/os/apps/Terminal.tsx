import React, { useState, useRef, useEffect } from 'react';

interface TerminalLine {
  type: 'input' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

export const Terminal: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      type: 'output',
      content: 'LimitlessOS Terminal v1.0.0',
      timestamp: new Date()
    },
    {
      type: 'output',
      content: 'Type "help" for available commands.',
      timestamp: new Date()
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = {
    help: () => [
      'Available commands:',
      '  help      - Show this help message',
      '  clear     - Clear terminal',
      '  whoami    - Display current user',
      '  date      - Show current date and time',
      '  pwd       - Show current directory',
      '  ls        - List directory contents',
      '  cat       - Display file contents',
      '  echo      - Echo text to terminal',
      '  neofetch  - System information',
      '  uname     - System information',
      '  ps        - List running processes',
      '  top       - Display system resources',
      '  df        - Show disk usage',
      '  free      - Show memory usage',
      '  history   - Show command history'
    ],
    clear: () => {
      setLines([]);
      return [];
    },
    whoami: () => ['limitless-user'],
    date: () => [new Date().toString()],
    pwd: () => ['/home/limitless-user'],
    ls: () => ['Documents/', 'Downloads/', 'Desktop/', 'Pictures/', 'Videos/', '.config/', 'README.txt'],
    cat: (args: string[]) => {
      const file = args[0];
      if (!file) return ['cat: missing file argument'];
      if (file === 'README.txt') {
        return [
          'Welcome to LimitlessOS!',
          '',
          'This is a next-generation operating system designed for infinite possibilities.',
          'Explore the system and discover what makes it limitless.',
          '',
          '- The LimitlessOS Team'
        ];
      }
      return [`cat: ${file}: No such file or directory`];
    },
    echo: (args: string[]) => [args.join(' ')],
    neofetch: () => [
      '                   ∞                   limitless-user@limitlessos',
      '                  ∞∞∞                  -------------------------',
      '                 ∞∞ ∞∞                 OS: LimitlessOS 1.0.0',
      '                ∞∞   ∞∞                Kernel: Limitless 6.1.0',
      '               ∞∞     ∞∞               Uptime: 2 hours, 34 mins',
      '              ∞∞       ∞∞              Shell: lsh 1.0.0',
      '               ∞∞     ∞∞               CPU: Intel i7-12700K',
      '                ∞∞   ∞∞                Memory: 16GB',
      '                 ∞∞ ∞∞                 Storage: 1TB NVMe SSD',
      '                  ∞∞∞                  Theme: Infinity Dark',
      '                   ∞                   '
    ],
    uname: () => ['LimitlessOS 1.0.0 limitless x86_64'],
    ps: () => [
      'PID    COMMAND',
      '1      init',
      '42     kernel',
      '128    desktop-manager',
      '256    terminal',
      '512    file-explorer'
    ],
    top: () => [
      'Tasks: 12 total, 1 running, 11 sleeping',
      'CPU usage: 2.3%',
      'Memory usage: 4.2GB / 16GB (26%)',
      'Load average: 0.45, 0.32, 0.28'
    ],
    df: () => [
      'Filesystem      Size  Used Avail Use% Mounted on',
      '/dev/sda1       1TB   256GB  744GB  26%  /',
      '/dev/sda2       500GB 128GB  372GB  26%  /home',
      'tmpfs           8GB   2MB    8GB    1%   /tmp'
    ],
    free: () => [
      'Total: 16GB',
      'Used: 4.2GB (26%)',
      'Free: 11.8GB',
      'Cached: 2.1GB'
    ],
    history: () => commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`)
  };

  const executeCommand = (command: string) => {
    const trimmed = command.trim();
    if (!trimmed) return;

    // Add to history
    setCommandHistory(prev => [...prev, trimmed]);
    
    // Add input line
    setLines(prev => [...prev, {
      type: 'input',
      content: `$ ${trimmed}`,
      timestamp: new Date()
    }]);

    // Parse command
    const [cmd, ...args] = trimmed.split(' ');
    const executor = commands[cmd as keyof typeof commands];

    let output: string[];
    if (executor) {
      output = executor(args);
    } else {
      output = [`Command not found: ${cmd}. Type "help" for available commands.`];
    }

    // Add output lines
    if (output.length > 0) {
      setLines(prev => [...prev, ...output.map(line => ({
        type: 'output' as const,
        content: line,
        timestamp: new Date()
      }))]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
      setCurrentInput('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="h-full bg-os-dark text-os-bright font-mono text-sm flex flex-col">
      <div
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto space-y-1"
      >
        {lines.map((line, i) => (
          <div key={i} className={`
            ${line.type === 'input' ? 'text-infinity-primary' : ''}
            ${line.type === 'error' ? 'text-error' : ''}
            ${line.type === 'output' ? 'text-os-bright' : ''}
          `}>
            {line.content}
          </div>
        ))}
      </div>
      
      <div className="px-4 pb-4 flex items-center">
        <span className="text-infinity-primary mr-2">$</span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-os-bright"
          placeholder="Type a command..."
          autoFocus
        />
      </div>
    </div>
  );
};