import React from 'react';

export type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactElement;
};

export function Tooltip({ content, children }: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <span className="relative inline-block">
      {React.cloneElement(children, {
        onMouseEnter: () => setOpen(true),
        onMouseLeave: () => setOpen(false),
        onFocus: () => setOpen(true),
        onBlur: () => setOpen(false),
      })}
      <span
        className={`pointer-events-none absolute left-1/2 z-20 mt-2 w-max -translate-x-1/2 select-none rounded-md bg-surface-2 px-3 py-1 text-xs text-text-primary shadow-lg opacity-0 transition-all duration-base ease-premium ${open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
        role="tooltip"
        aria-hidden={!open}
      >
        {content}
      </span>
    </span>
  );
}
