import React from 'react';

interface RupeeIconProps {
  className?: string;
  width?: number;
  height?: number;
}

const RupeeIcon: React.FC<RupeeIconProps> = ({ className = '', width = 512, height = 512 }) => {
  return (
    <svg 
      className={className}
      width={width} 
      height={height} 
      viewBox="0 0 512 512" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block' }}
    >
      <g fill="none" stroke="currentColor" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round">
        <path d="M144 128h224" />
        <path d="M144 192h224" />
        <path d="M256 384l-112-112h112c64 0 96-32 96-80s-32-64-80-64h-128" />
      </g>
    </svg>
  );
};

export default RupeeIcon;
