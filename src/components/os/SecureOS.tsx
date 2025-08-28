import React, { useState } from 'react';
import { BootSplash } from './BootSplash';
import { Desktop } from './Desktop';

export const SecureOS: React.FC = () => {
  const [isBooted, setIsBooted] = useState(false);

  const handleBootComplete = () => {
    setIsBooted(true);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-os-void">
      {!isBooted ? (
        <BootSplash onBootComplete={handleBootComplete} />
      ) : (
        <Desktop />
      )}
    </div>
  );
};