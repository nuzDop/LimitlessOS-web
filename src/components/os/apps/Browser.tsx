import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Lock } from 'lucide-react';

export const Browser: React.FC = () => {
  const [url, setUrl] = useState('https://www.google.com/webhp?igu=1');
  const [displayUrl, setDisplayUrl] = useState('https://www.google.com');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleGo = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = displayUrl;
    if (!finalUrl.startsWith('http')) {
      finalUrl = `https://` + finalUrl;
    }
    setUrl(finalUrl);
  };

  const handleNav = (action: 'back' | 'forward' | 'reload' | 'home') => {
    if (!iframeRef.current) return;
    try {
      switch (action) {
        case 'back':
          iframeRef.current.contentWindow?.history.back();
          break;
        case 'forward':
          iframeRef.current.contentWindow?.history.forward();
          break;
        case 'reload':
          iframeRef.current.src = iframeRef.current.src;
          break;
        case 'home':
          const homeUrl = 'https://www.google.com/webhp?igu=1';
          setUrl(homeUrl);
          setDisplayUrl('https://www.google.com');
          break;
      }
    } catch (e) {
        console.error("Browser navigation failed (cross-origin restrictions):", e);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="bg-os-light text-os-dark flex items-center p-2 border-b border-os-medium">
        <button onClick={() => handleNav('back')} className="p-1 rounded-full hover:bg-os-medium"><ArrowLeft size={16}/></button>
        <button onClick={() => handleNav('forward')} className="p-1 rounded-full hover:bg-os-medium"><ArrowRight size={16}/></button>
        <button onClick={() => handleNav('reload')} className="p-1 rounded-full hover:bg-os-medium ml-1"><RotateCw size={16}/></button>
        <button onClick={() => handleNav('home')} className="p-1 rounded-full hover:bg-os-medium ml-1"><Home size={16}/></button>
        
        <div className="flex-1 mx-2 bg-os-dark rounded-full flex items-center px-3">
            <Lock size={12} className="text-os-light mr-2"/>
            <form onSubmit={handleGo} className="w-full">
                <input
                    type="text"
                    value={displayUrl}
                    onChange={(e) => setDisplayUrl(e.target.value)}
                    className="w-full bg-transparent text-os-bright text-sm outline-none h-8"
                />
            </form>
        </div>
      </div>
      <div className="flex-1 bg-gray-400">
        <iframe
          ref={iframeRef}
          src={url}
          className="w-full h-full border-0"
          sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
          title="Browser"
        />
      </div>
    </div>
  );
};
