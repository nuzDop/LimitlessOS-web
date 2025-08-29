import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Home, 
  Star, 
  Plus,
  X,
  Settings,
  Download,
  Shield
} from 'lucide-react';

export const Firefox: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('https://www.mozilla.org');
  const [inputUrl, setInputUrl] = useState('https://www.mozilla.org');
  const [tabs, setTabs] = useState([
    { id: '1', title: 'Mozilla Firefox', url: 'https://www.mozilla.org', active: true }
  ]);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleNavigate = (url: string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    setIsLoading(true);
    setCurrentUrl(url);
    setInputUrl(url);
    
    // Update active tab
    setTabs(prev => prev.map(tab => 
      tab.active ? { ...tab, url, title: new URL(url).hostname } : tab
    ));

    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleAddTab = () => {
    const newTab = {
      id: Date.now().toString(),
      title: 'New Tab',
      url: 'about:blank',
      active: false
    };
    setTabs(prev => [...prev.map(t => ({ ...t, active: false })), { ...newTab, active: true }]);
    setCurrentUrl('about:blank');
    setInputUrl('');
  };

  const handleCloseTab = (tabId: string) => {
    setTabs(prev => {
      const filtered = prev.filter(t => t.id !== tabId);
      if (filtered.length === 0) return prev;
      
      const closedTabWasActive = prev.find(t => t.id === tabId)?.active;
      if (closedTabWasActive && filtered.length > 0) {
        filtered[0].active = true;
        setCurrentUrl(filtered[0].url);
        setInputUrl(filtered[0].url);
      }
      return filtered;
    });
  };

  const handleTabSwitch = (tabId: string) => {
    setTabs(prev => prev.map(tab => ({
      ...tab,
      active: tab.id === tabId
    })));
    const activeTab = tabs.find(t => t.id === tabId);
    if (activeTab) {
      setCurrentUrl(activeTab.url);
      setInputUrl(activeTab.url);
    }
  };

  const bookmarks = [
    { name: 'Google', url: 'https://www.google.com' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com' },
    { name: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
  ];

  return (
    <div className="flex flex-col h-full bg-os-dark text-os-bright">
      {/* Tab Bar */}
      <div className="flex items-center bg-os-shadow px-2 py-1 border-b border-os-medium">
        <div className="flex-1 flex items-center space-x-1 overflow-x-auto">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`flex items-center space-x-2 px-3 py-1 rounded-t-lg cursor-pointer min-w-0 max-w-48 ${
                tab.active ? 'bg-os-dark' : 'bg-os-medium hover:bg-os-dark'
              }`}
              onClick={() => handleTabSwitch(tab.id)}
            >
              <span className="truncate text-sm">{tab.title}</span>
              {tabs.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-os-light"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseTab(tab.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddTab}
          className="ml-2 h-6 w-6 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center space-x-2 p-2 bg-os-shadow border-b border-os-medium">
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={!canGoBack}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={!canGoForward}
            className="h-8 w-8 p-0"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handleNavigate(currentUrl)}
          >
            <RotateCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handleNavigate('https://www.mozilla.org')}
          >
            <Home className="h-4 w-4" />
          </Button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 flex items-center">
          <div className="flex-1 relative">
            <Input
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNavigate(inputUrl)}
              className="pr-8 bg-os-dark border-os-medium text-os-bright"
              placeholder="Search or enter address"
            />
            <Shield className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-success" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 h-8 w-8 p-0"
          >
            <Star className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bookmarks Bar */}
      <div className="flex items-center space-x-1 px-2 py-1 bg-os-medium border-b border-os-dark">
        {bookmarks.map((bookmark, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className="text-xs h-6"
            onClick={() => handleNavigate(bookmark.url)}
          >
            {bookmark.name}
          </Button>
        ))}
      </div>

      {/* Browser Content */}
      <div className="flex-1 relative bg-os-pure">
        {currentUrl === 'about:blank' ? (
          <div className="flex items-center justify-center h-full bg-os-dark">
            <div className="text-center">
              <div className="text-4xl mb-4">🦊</div>
              <h2 className="text-xl font-semibold text-os-bright mb-2">Firefox Browser</h2>
              <p className="text-os-light mb-4">Start browsing by entering a URL above</p>
              <div className="grid grid-cols-2 gap-2 max-w-md">
                {bookmarks.map((bookmark, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left"
                    onClick={() => handleNavigate(bookmark.url)}
                  >
                    {bookmark.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full relative">
            {isLoading && (
              <div className="absolute inset-0 bg-os-dark/50 flex items-center justify-center z-10">
                <div className="text-os-bright">Loading...</div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={currentUrl}
              className="w-full h-full border-none"
              title="Browser Content"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                // Handle iframe errors
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};