import React, { useEffect, useState } from 'react';

interface BootSplashProps {
  onBootComplete: () => void;
}

const InfinitySymbol = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 200 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M50 50C50 22 72 0 100 0s50 22 50 50-22 50-50 50-22-22 0-50 22-50 50-50 50 22 50 50-22 50-50 50-50-22-50-50z"
      fill="none"
      stroke="url(#infinityGradient)"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient id="infinityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(var(--infinity-primary))" />
        <stop offset="50%" stopColor="hsl(var(--infinity-glow))" />
        <stop offset="100%" stopColor="hsl(var(--infinity-secondary))" />
      </linearGradient>
    </defs>
  </svg>
);

export const BootSplash: React.FC<BootSplashProps> = ({ onBootComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Initializing LimitlessOS...");
  
  const bootStages = [
    "Initializing LimitlessOS...",
    "Loading kernel modules...",
    "Mounting file systems...",
    "Starting system services...",
    "Preparing desktop environment...",
    "Ready."
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
        {/* Infinity Logo */}
        <div className="relative">
          <InfinitySymbol className="w-32 h-16 infinity-glow" />
          <div className="absolute inset-0 w-32 h-16">
            <InfinitySymbol className="w-32 h-16 opacity-30 animate-[infinityRotate_8s_linear_infinite]" />
          </div>
        </div>
        
        {/* OS Name */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-infinity-primary to-infinity-secondary bg-clip-text text-transparent">
            LimitlessOS
          </h1>
          <p className="text-os-light text-lg mt-2">Elite Operating System</p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-80 bg-os-dark rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-infinity-primary to-infinity-secondary transition-all duration-300 ease-out"
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
            className="absolute w-1 h-1 bg-infinity-glow rounded-full opacity-60 animate-pulse"
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