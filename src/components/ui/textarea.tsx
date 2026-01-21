import * as React from 'react';
import { cn } from './utils';

export interface TextareaProps {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => void;
  disabled?: boolean;
  rows?: number;
  [key: string]: any;
}

const Textarea = React.forwardRef(
  ({ className, ...props }: any, ref: any) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-lg border border-border bg-background-secondary px-3 py-2',
          'text-sm text-foreground placeholder:text-foreground-subtle',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'resize-y transition-all',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
