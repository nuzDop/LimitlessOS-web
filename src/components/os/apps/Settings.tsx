import React, { useState } from 'react';

interface SettingsSection {
  id: string;
  name: string;
  icon: string;
}

interface SettingItem {
  id: string;
  name: string;
  type: 'toggle' | 'slider' | 'select' | 'input';
  value: any;
  options?: string[];
  min?: number;
  max?: number;
}

const settingsSections: SettingsSection[] = [
  { id: 'appearance', name: 'Appearance', icon: '🎨' },
  { id: 'system', name: 'System', icon: '⚙️' },
  { id: 'display', name: 'Display', icon: '🖥️' },
  { id: 'audio', name: 'Audio', icon: '🔊' },
  { id: 'network', name: 'Network', icon: '🌐' },
  { id: 'privacy', name: 'Privacy & Security', icon: '🔒' }
];

const settingsData: Record<string, SettingItem[]> = {
  appearance: [
    { id: 'theme', name: 'Theme', type: 'select', value: 'Infinity Dark', options: ['Infinity Dark', 'Infinity Light', 'High Contrast'] },
    { id: 'accent', name: 'Accent Color', type: 'select', value: 'Blue', options: ['Blue', 'Purple', 'Cyan', 'Green', 'Orange'] },
    { id: 'transparency', name: 'Window Transparency', type: 'slider', value: 80, min: 0, max: 100 },
    { id: 'animations', name: 'Enable Animations', type: 'toggle', value: true }
  ],
  system: [
    { id: 'startup_sound', name: 'Startup Sound', type: 'toggle', value: true },
    { id: 'auto_update', name: 'Automatic Updates', type: 'toggle', value: true },
    { id: 'telemetry', name: 'Send Usage Data', type: 'toggle', value: false },
    { id: 'crash_reports', name: 'Send Crash Reports', type: 'toggle', value: true }
  ],
  display: [
    { id: 'brightness', name: 'Brightness', type: 'slider', value: 75, min: 0, max: 100 },
    { id: 'resolution', name: 'Resolution', type: 'select', value: '1920x1080', options: ['1920x1080', '2560x1440', '3840x2160'] },
    { id: 'refresh_rate', name: 'Refresh Rate', type: 'select', value: '60Hz', options: ['60Hz', '120Hz', '144Hz', '240Hz'] },
    { id: 'night_mode', name: 'Night Mode', type: 'toggle', value: false }
  ],
  audio: [
    { id: 'master_volume', name: 'Master Volume', type: 'slider', value: 50, min: 0, max: 100 },
    { id: 'system_sounds', name: 'System Sounds', type: 'toggle', value: true },
    { id: 'output_device', name: 'Output Device', type: 'select', value: 'Speakers', options: ['Speakers', 'Headphones', 'HDMI Audio'] },
    { id: 'input_device', name: 'Input Device', type: 'select', value: 'Internal Microphone', options: ['Internal Microphone', 'External Microphone', 'USB Headset'] }
  ],
  network: [
    { id: 'wifi', name: 'Wi-Fi', type: 'toggle', value: true },
    { id: 'ethernet', name: 'Ethernet', type: 'toggle', value: false },
    { id: 'bluetooth', name: 'Bluetooth', type: 'toggle', value: true },
    { id: 'firewall', name: 'Firewall', type: 'toggle', value: true }
  ],
  privacy: [
    { id: 'location', name: 'Location Services', type: 'toggle', value: false },
    { id: 'camera', name: 'Camera Access', type: 'toggle', value: true },
    { id: 'microphone', name: 'Microphone Access', type: 'toggle', value: true },
    { id: 'file_encryption', name: 'File Encryption', type: 'toggle', value: true }
  ]
};

export const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('appearance');
  const [settings, setSettings] = useState(settingsData);

  const updateSetting = (sectionId: string, settingId: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [sectionId]: prev[sectionId].map(setting =>
        setting.id === settingId ? { ...setting, value } : setting
      )
    }));
  };

  const renderSettingControl = (sectionId: string, setting: SettingItem) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={setting.value}
              onChange={(e) => updateSetting(sectionId, setting.id, e.target.checked)}
              className="sr-only"
            />
            <div className={`
              w-12 h-6 rounded-full transition-colors duration-300 relative
              ${setting.value ? 'bg-infinity-primary' : 'bg-os-medium'}
            `}>
              <div className={`
                w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300
                ${setting.value ? 'translate-x-6' : 'translate-x-0.5'}
              `} />
            </div>
          </label>
        );

      case 'slider':
        return (
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min={setting.min || 0}
              max={setting.max || 100}
              value={setting.value}
              onChange={(e) => updateSetting(sectionId, setting.id, parseInt(e.target.value))}
              className="flex-1 h-2 bg-os-medium rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-sm text-os-light min-w-[3ch]">{setting.value}</span>
          </div>
        );

      case 'select':
        return (
          <select
            value={setting.value}
            onChange={(e) => updateSetting(sectionId, setting.id, e.target.value)}
            className="bg-os-medium border border-os-light/20 rounded px-3 py-1 text-os-bright focus:border-infinity-primary outline-none"
          >
            {setting.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'input':
        return (
          <input
            type="text"
            value={setting.value}
            onChange={(e) => updateSetting(sectionId, setting.id, e.target.value)}
            className="bg-os-medium border border-os-light/20 rounded px-3 py-1 text-os-bright focus:border-infinity-primary outline-none"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-os-dark text-os-bright flex">
      {/* Sidebar */}
      <div className="w-64 bg-os-medium border-r border-os-light/20">
        <div className="p-4 border-b border-os-light/20">
          <h2 className="text-xl font-bold bg-gradient-to-r from-infinity-primary to-infinity-secondary bg-clip-text text-transparent">
            Settings
          </h2>
        </div>
        
        <div className="p-2">
          {settingsSections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                w-full flex items-center space-x-3 px-3 py-2 rounded text-left transition-colors
                ${activeSection === section.id 
                  ? 'bg-infinity-primary/20 text-infinity-primary border border-infinity-primary/50' 
                  : 'hover:bg-os-dark/50 text-os-light hover:text-os-bright'
                }
              `}
            >
              <span className="text-lg">{section.icon}</span>
              <span className="font-medium">{section.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-6">
            {settingsSections.find(s => s.id === activeSection)?.name}
          </h3>
          
          <div className="space-y-6">
            {settings[activeSection]?.map(setting => (
              <div key={setting.id} className="flex items-center justify-between p-4 bg-os-medium/30 rounded-lg border border-os-light/10">
                <div>
                  <div className="font-medium text-os-bright">{setting.name}</div>
                  {setting.id === 'theme' && (
                    <div className="text-sm text-os-light mt-1">Choose your visual style</div>
                  )}
                  {setting.id === 'transparency' && (
                    <div className="text-sm text-os-light mt-1">Adjust window opacity</div>
                  )}
                </div>
                <div className="ml-4">
                  {renderSettingControl(activeSection, setting)}
                </div>
              </div>
            ))}
          </div>

          {/* System Info */}
          {activeSection === 'system' && (
            <div className="mt-8 p-4 bg-os-medium/30 rounded-lg border border-os-light/10">
              <h4 className="font-bold text-os-bright mb-3">System Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-os-light">OS Version:</span>
                  <span className="ml-2 text-os-bright">LimitlessOS 1.0.0</span>
                </div>
                <div>
                  <span className="text-os-light">Kernel:</span>
                  <span className="ml-2 text-os-bright">6.1.0-limitless</span>
                </div>
                <div>
                  <span className="text-os-light">Uptime:</span>
                  <span className="ml-2 text-os-bright">2h 34m</span>
                </div>
                <div>
                  <span className="text-os-light">Memory:</span>
                  <span className="ml-2 text-os-bright">4.2GB / 16GB</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};