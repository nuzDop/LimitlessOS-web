// A basic Virtual File System using localStorage to simulate persistence.

interface VFSObject {
  type: 'file' | 'folder';
  content?: string; // For files
  children?: { [key: string]: VFSObject }; // For folders
  modified: string;
}

const VFS_STORAGE_KEY = 'limitlessos_vfs';

const getDefaultFileSystem = (): { [key: string]: VFSObject } => ({
  'home': {
    type: 'folder',
    modified: new Date().toISOString(),
    children: {
      'limitless-user': {
        type: 'folder',
        modified: new Date().toISOString(),
        children: {
          'Documents': { type: 'folder', modified: new Date().toISOString(), children: {} },
          'Downloads': { type: 'folder', modified: new Date().toISOString(), children: {} },
          'README.txt': {
            type: 'file',
            modified: new Date().toISOString(),
            content: 'Welcome to LimitlessOS!\n\nThis is a web-based simulation of a universal, elite-grade operating system.\n\n- Use the terminal to create files (`touch test.txt`) and folders (`mkdir my_folder`).\n- Your changes will be saved in this browser\'s localStorage, so they will persist across sessions.'
          }
        }
      }
    }
  }
});

const getFileSystem = (): { [key: string]: VFSObject } => {
  try {
    const storedVFS = localStorage.getItem(VFS_STORAGE_KEY);
    if (storedVFS) {
      return JSON.parse(storedVFS);
    }
    const defaultFS = { '/': { type: 'folder', modified: new Date().toISOString(), children: getDefaultFileSystem() }};
    localStorage.setItem(VFS_STORAGE_KEY, JSON.stringify(defaultFS));
    return defaultFS;
  } catch (error) {
    console.error("Failed to load VFS from localStorage:", error);
    return { '/': { type: 'folder', modified: new Date().toISOString(), children: getDefaultFileSystem() }};
  }
};

const saveFileSystem = (vfs: { [key: string]: VFSObject }) => {
  try {
    localStorage.setItem(VFS_STORAGE_KEY, JSON.stringify(vfs));
  } catch (error) {
    console.error("Failed to save VFS to localStorage:", error);
  }
};

const getObjectFromPath = (path: string): { parent: VFSObject | null, obj: VFSObject | null, key: string } => {
    const fs = getFileSystem();
    const segments = path.split('/').filter(Boolean);
    let current: VFSObject = fs['/'];
    let parent: VFSObject | null = null;

    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        if (current && current.type === 'folder' && current.children && current.children[segment]) {
            parent = current;
            current = current.children[segment];
        } else {
            return { parent: null, obj: null, key: '' };
        }
    }
    return { parent, obj: current, key: segments[segments.length - 1] || '/' };
};


export const vfs = {
  readDir: (path: string) => {
    const { obj } = getObjectFromPath(path);
    if (obj && obj.type === 'folder') {
      return obj.children || {};
    }
    return null;
  },

  readFile: (path: string) => {
    const { obj } = getObjectFromPath(path);
    if (obj && obj.type === 'file') {
      return obj.content || '';
    }
    return null;
  },

  create: (path: string, type: 'file' | 'folder', content = '') => {
    const fs = getFileSystem();
    const lastSlash = path.lastIndexOf('/');
    const parentPath = lastSlash === 0 ? '/' : path.substring(0, lastSlash) || '/';
    const name = path.substring(lastSlash + 1);

    const { obj: parent } = getObjectFromPath(parentPath);

    if (parent && parent.type === 'folder' && parent.children) {
        if (parent.children[name]) {
            return false; // Already exists
        }
        parent.children[name] = type === 'file' 
            ? { type: 'file', content, modified: new Date().toISOString() }
            : { type: 'folder', children: {}, modified: new Date().toISOString() };
        saveFileSystem(fs);
        return true;
    }
    return false;
  },

  delete: (path: string) => {
    const fs = getFileSystem();
    const { parent, key } = getObjectFromPath(path);
    if (parent && parent.children && key && parent.children[key]) {
        delete parent.children[key];
        saveFileSystem(fs);
        return true;
    }
    return false;
  }
};
