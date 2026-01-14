import React from 'react';

export const Divider: React.FC<React.HTMLAttributes<HTMLHRElement>> = ({ className = '', ...props }) => (
  <hr
    className={`my-4 border-t border-border/15 w-full ${className}`}
    {...props}
  />
);
