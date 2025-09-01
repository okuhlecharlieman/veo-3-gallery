import React from 'react';

export const VideoCameraIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <rect x="3" y="7" width="15" height="10" rx="2" />
    <polygon points="20,7 23,12 20,17" />
  </svg>
);
