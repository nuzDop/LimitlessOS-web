import React, { useEffect, useState } from 'react';

interface BootSplashProps {
  onBootComplete: () => void;
}

const SecureShield = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Shield outline */}
    <path
      d="M100 20 L160 50 L160 120 C160 150 130 180 100 180 C70 180 40 150 40 120 L40 50 Z"
      fill="none"
      stroke="url(#shieldGradient)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    
    {/* Inner security elements */}
    <circle
      cx="100"
      cy="90"
      r="25"
      fill="none"
      stroke="url(#shieldGradient)"
      strokeWidth="2"
      opacity="0.7"
    />
    
    {/* Lock symbol */}
    <rect
      x="90"
      y="100"
      width="20"
      height="15"
      rx="2"
      fill="url(#shieldGradient)"
      opacity="0.8"
    />
    
    <circle
      cx="100"
      cy="85"
      r="8"
      fill="none"
      stroke="url(#shieldGradient)"
      strokeWidth="3"
    />
    
    <defs>
      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--military-primary))" />
        <stop offset="50%" stopColor="hsl(var(--military-accent))" />
        <stop offset="100%" stopColor="hsl(var(--military-secondary))" />
      </linearGradient>
    </defs>
  </svg>
);

export const BootSplash: React.FC<BootSplashProps> = ({ onBootComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Initializing SecureOS...");
  
  const bootStages = [
    "Initializing SecureOS...",
    "Loading security modules...",
    "Mounting encrypted file systems...",
    "Starting enterprise services...",
    "Preparing secure desktop environment...",
    "System ready for operation."
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onBootComplete, 1000);
          return 100;
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 200);

    const stageInterval = setInterval(() => {
      setStage((prev) => {
        const currentIndex = bootStages.indexOf(prev);
        if (currentIndex < bootStages.length - 1) {
          return bootStages[currentIndex + 1];
        }
        clearInterval(stageInterval);
        return prev;
      });
    }, 1200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stageInterval);
    };
  }, [onBootComplete]);

  return (
    <div className="fixed inset-0 bg-os-void flex flex-col items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-os-void via-os-shadow to-os-dark opacity-80" />
      
      {/* Boot Animation */}
      <div className="relative z-10 flex flex-col items-center space-y-8 animate-[bootFade_2s_ease-out]">
        {/* Security Shield Logo */}
        <div className="relative">
          <SecureShield className="w-32 h-32 military-glow" />
          <div className="absolute inset-0 w-32 h-32">
            <SecureShield className="w-32 h-32 opacity-30 animate-[militaryRotate_8s_linear_infinite]" />
          </div>
        </div>
        
        {/* OS Name */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-military-primary to-military-secondary bg-clip-text text-transparent">
            SecureOS
          </h1>
          <p className="text-os-light text-lg mt-2">Military & Business Grade</p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-80 bg-os-dark rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-military-primary to-military-secondary transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        
        {/* Boot Stage */}
        <p className="text-os-light text-center min-h-[24px]">{stage}</p>
      </div>
      
      {/* Particle Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-military-primary rounded-full opacity-60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};