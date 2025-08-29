import React, { useEffect, useState } from 'react';

interface BootSplashProps {
  onBootComplete: () => void;
}

export const BootSplash: React.FC<BootSplashProps> = ({ onBootComplete }) => {
  const [stage, setStage] = useState("INITIALIZING KERNEL");
  const [fadeout, setFadeout] = useState(false);

  const bootStages = [
    "MOUNTING VFS",
    "STARTING SERVICES",
    "PREPARING DESKTOP",
    "WELCOME"
  ];

  useEffect(() => {
    const stageTimers = bootStages.map((bootStage, index) => 
      setTimeout(() => setStage(bootStage), (index + 1) * 800 + 500)
    );

    const bootTimeout = setTimeout(() => {
      setFadeout(true);
      setTimeout(onBootComplete, 500);
    }, 4500);

    return () => {
      stageTimers.forEach(clearTimeout);
      clearTimeout(bootTimeout);
    };
  }, [onBootComplete]);

  return (
    <div className={`fixed inset-0 bg-os-void flex flex-col items-center justify-center transition-opacity duration-500 ${fadeout ? 'opacity-0' : 'opacity-100'}`}>
      {/* Container is now a flexbox to center the image */}
      <div className="w-48 h-48 animate-[bootFade_2s_ease-out] flex items-center justify-center">
        <img src="/infinity_splash.png" alt="LimitlessOS Boot" className="w-full h-full object-contain" />
      </div>
      <p className="text-os-light text-sm tracking-[0.3em] font-mono mt-4 animate-pulse">
        {stage}
      </p>
    </div>
  );
};
