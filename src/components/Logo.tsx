import React from 'react';
import rezmeLogo from '../assets/rezme-logo.svg';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => (
  <div className={`flex justify-center ${className}`}>
    <img 
      src={rezmeLogo} 
      alt="Rézme Logo" 
      className="h-12 w-auto"
      style={{ maxWidth: '180px' }}
    />
  </div>
); 