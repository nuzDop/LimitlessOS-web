import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { App } from './Desktop';
import { Search, X } from 'lucide-react';

interface ActivitiesOverviewProps {
  apps: App[];
  onAppSelect: (app: App) => void;
  onClose: () => void;
}

export const ActivitiesOverview: React.FC<ActivitiesOverviewProps> = ({ 
  apps, 
  onAppSelect, 
  onClose 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentFiles = [
    { name: 'Project Proposal.pdf', type: 'document', modified: '2 hours ago' },
    { name: 'Meeting Notes.txt', type: 'text', modified: '1 day ago' },
    { name: 'Budget Spreadsheet.xlsx', type: 'spreadsheet', modified: '3 days ago' },
    { name: 'Design Mockup.png', type: 'image', modified: '1 week ago' },
  ];

  return (
    <div className="fixed inset-0 bg-os-void/95 backdrop-blur-md z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold text-os-bright">Activities Overview</h1>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Search */}
      <div className="px-6 mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-os-light" />
          <Input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-os-dark border-os-medium text-os-bright"
            autoFocus
          />
        </div>
      </div>

      <div className="flex-1 px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Applications */}
        <div>
          <h2 className="text-lg font-semibold text-os-bright mb-4">Applications</h2>
          <div className="grid grid-cols-4 gap-4">
            {filteredApps.map((app) => (
              <button
                key={app.id}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-os-medium/20 transition-colors group"
                onClick={() => {
                  onAppSelect(app);
                  onClose();
                }}
              >
                <div className="w-16 h-16 bg-os-medium/20 rounded-lg flex items-center justify-center mb-2 group-hover:bg-os-medium/40 transition-colors">
                  <span className="text-2xl">{app.icon}</span>
                </div>
                <span className="text-os-bright text-sm text-center">{app.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Files */}
        <div>
          <h2 className="text-lg font-semibold text-os-bright mb-4">Recent Files</h2>
          <div className="space-y-3">
            {recentFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center p-3 rounded-lg hover:bg-os-medium/20 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 bg-os-medium/30 rounded flex items-center justify-center mr-3">
                  <span className="text-sm">📄</span>
                </div>
                <div className="flex-1">
                  <div className="text-os-bright text-sm font-medium">{file.name}</div>
                  <div className="text-os-light text-xs">{file.modified}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};