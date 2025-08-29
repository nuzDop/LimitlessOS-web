import React, { useState, useRef, useEffect } from 'react';
import { vfs } from '@/lib/vfs';

interface TerminalLine {
  type: 'input' | 'output' | 'error';
  content: string;
}

export const Terminal: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: 'LimitlessOS Universal Terminal [Version 2.0.0]' },
    { type: 'output', content: 'Enter "help" for a list of commands.' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentUser, setCurrentUser] = useState('limitless-user');
  const [currentPath, setCurrentPath] = useState('/home/limitless-user');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const resolvePath = (path: string) => {
    if (path.startsWith('/')) return path;
    if (path === '..') {
      // Prevent going above root
      if (currentPath === '/') return '/';
      return currentPath.substring(0, currentPath.lastIndexOf('/')) || '/';
    }
    const newPath = currentPath === '/' ? '' : currentPath;
    return `${newPath}/${path}`;
  };

  const commands: { [key: string]: (args: string[]) => string[] } = {
    help: () => [
        '-- LimitlessOS Universal Command Simulation --',
        'help             - Shows this help message.',
        'clear / cls      - Clears the terminal screen.',
        'date             - Displays the current date and time.',
        'echo [text]      - Displays text.',
        'whoami           - Displays the current user.',
        'uname / systeminfo - Displays system information.',
        'pwd / cd         - Prints the working directory (CMD `cd` w/o args).',
        'su / sudo -i     - Switch to the root user.',
        'exit             - Exit the root user shell.',
        '-- File System (aliases for Linux, CMD, and PowerShell) --',
        'ls / dir / gci   - Lists directory contents.',
        'cd / sl [dir]    - Changes directory.',
        'cat / gc [file]  - Displays file content.',
        'touch / New-Item [file] - Creates an empty file.',
        'mkdir / md [dir] - Creates a directory.',
        'rm / del / rd [item] - Deletes a file or directory.',
        'mv / ren [src] [dest] - Moves or renames a file or directory.',
        'sudo [cmd]       - Simulates running a command as administrator.',
    ],
    clear: () => { setLines([]); return []; },
    cls: () => commands.clear([]),
    'Clear-Host': () => commands.clear([]),
    date: () => [new Date().toString()],
    echo: (args) => [args.join(' ')],
    whoami: () => [currentUser],
    uname: () => ['LimitlessOS 2.0.0 (web-sim) x86_64 GNU/Limitless'],
    systeminfo: () => [
        'Host Name:                 LIMITLESS-VM',
        'OS Name:                   LimitlessOS',
        'OS Version:                2.0.0 Professional',
        'System Type:               x64-based PC',
    ],
    pwd: () => [currentPath],
    
    ls: (args) => {
        const path = args.length > 0 ? resolvePath(args[0]) : currentPath;
        const items = vfs.readDir(path);
        if (items) {
            const names = Object.keys(items);
            return names.length > 0 ? names.map(name => items[name].type === 'folder' ? `${name}/` : name) : [''];
        }
        return [`ls: cannot access '${path}': No such directory`];
    },
    dir: (args) => commands.ls(args),
    gci: (args) => commands.ls(args),
    
    cd: (args) => {
        if (args.length === 0) return commands.pwd([]);
        const target = args[0];
        let newPath = resolvePath(target);
        if (vfs.readDir(newPath)) {
            setCurrentPath(newPath);
            return [];
        }
        return [`cd: no such file or directory: ${target}`];
    },
    sl: (args) => commands.cd(args),
    'Set-Location': (args) => commands.cd(args),

    cat: (args) => {
        if (!args[0]) return ['cat: missing operand'];
        const path = resolvePath(args[0]);
        const content = vfs.readFile(path);
        return content !== null ? content.split('\n') : [`cat: ${args[0]}: No such file`];
    },
    gc: (args) => commands.cat(args),
    'Get-Content': (args) => commands.cat(args),

    touch: (args) => {
        if (!args[0]) return ['touch: missing file operand'];
        const path = resolvePath(args[0]);
        return vfs.create(path, 'file') ? [] : [`touch: cannot create file '${args[0]}': File exists or invalid path`];
    },

    mkdir: (args) => {
        if (!args[0]) return ['mkdir: missing operand'];
        const path = resolvePath(args[0]);
        return vfs.create(path, 'folder') ? [] : [`mkdir: cannot create directory '${args[0]}': File exists or invalid path`];
    },
    md: (args) => commands.mkdir(args),
    
    'New-Item': (args) => {
        const pathIndex = args.findIndex(a => a === '-Path');
        const typeIndex = args.findIndex(a => a === '-ItemType');
        if (pathIndex === -1 || pathIndex + 1 >= args.length) return ['New-Item: Missing path'];
        const path = resolvePath(args[pathIndex + 1]);
        const type = (typeIndex !== -1 && typeIndex + 1 < args.length) ? args[typeIndex + 1] : 'file';
        if (type.toLowerCase() === 'directory') return commands.mkdir([path]);
        return commands.touch([path]);
    },
    
    rm: (args) => {
        if (!args[0]) return ['rm: missing operand'];
        const path = resolvePath(args[0]);
        return vfs.delete(path) ? [] : [`rm: cannot remove '${args[0]}': No such file or directory`];
    },
    del: (args) => commands.rm(args),
    rd: (args) => commands.rm(args),
    rmdir: (args) => commands.rm(args),
    'Remove-Item': (args) => commands.rm(args),

    mv: (args) => {
        if (args.length < 2) return ['mv: missing destination file operand after ' + args[0]];
        const source = resolvePath(args[0]);
        const dest = resolvePath(args[1]);
        return vfs.move(source, dest) ? [] : ['mv: cannot move file'];
    },
    ren: (args) => commands.mv(args),
    'Rename-Item': (args) => commands.mv(args),
    
    su: () => {
        setCurrentUser('root');
        setCurrentPath('/root');
        return ['(Password simulation) Switched to root user.'];
    },
    
    exit: () => {
        if (currentUser === 'root') {
            setCurrentUser('limitless-user');
            setCurrentPath('/home/limitless-user');
            return ['Logged out from root.'];
        }
        return [];
    },

    sudo: (args) => {
        if (!args[0]) return ['sudo: a command is required'];
        
        if (args[0] === '-i' || args[0] === '-s') {
            return commands.su();
        }
        
        const cmd = args[0];
        const cmdArgs = args.slice(1);
        if (commands[cmd]) {
            return [`(Password simulation) Running '${cmd}' as root...`, ...commands[cmd](cmdArgs)];
        }
        return [`sudo: ${cmd}: command not found`];
    }
  };

  const executeCommand = (command: string) => {
    const trimmed = command.trim();
    if (!trimmed) return;
    setCommandHistory(prev => [trimmed, ...prev]);
    const prompt = currentUser === 'root' ? '#' : '$';
    const path = currentUser === 'root' ? '/root' : currentPath;
    setLines(prev => [...prev, { type: 'input', content: `[${path}]${prompt} ${trimmed}` }]);
    
    const [cmd, ...args] = trimmed.split(/\s+/);
    const executor = commands[cmd];
    const output = executor ? executor(args) : [`command not found: ${cmd}`];

    if (output.length > 0 && (output.length > 1 || output[0] !== '')) {
      setLines(prev => [...prev, ...output.map(line => ({ type: 'output' as const, content: line }))]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
      setCurrentInput('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      } else {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  useEffect(() => {
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
  }, [lines]);
  
  const prompt = currentUser === 'root' ? '#' : '$';
  const path = currentUser === 'root' ? '/root' : currentPath;

  return (
    <div className="h-full bg-os-dark text-os-bright font-mono text-sm flex flex-col" onClick={() => inputRef.current?.focus()}>
      <div ref={terminalRef} className="flex-1 p-2 overflow-y-auto">
        {lines.map((line, i) => (
          <div key={i} className={`${line.type === 'input' ? 'text-professional-primary' : ''}`}>
            <pre className="whitespace-pre-wrap">{line.content}</pre>
          </div>
        ))}
      </div>
      
      <div className="p-2 flex items-center border-t border-os-medium">
        <span className={`mr-2 ${currentUser === 'root' ? 'text-professional-critical' : 'text-professional-secondary'}`}>
          {`[${path}]${prompt}`}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-os-bright"
          autoFocus
        />
      </div>
    </div>
  );
};
