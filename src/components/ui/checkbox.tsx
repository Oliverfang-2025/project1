import * as React from 'react';
import { cn } from './utils';
import { Check } from 'lucide-react';

export interface CheckboxProps {
  label?: string;
  id?: string;
  className?: string;
  checked?: boolean;
  onChange?: (e: any) => void;
  disabled?: boolean;
  [key: string]: any;
}

const Checkbox = React.forwardRef(
  ({ className, label, id, ...props }: any, ref: any) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            className={cn(
              'peer h-5 w-5 shrink-0 rounded border border-border bg-background-secondary',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-all cursor-pointer appearance-none',
              'checked:bg-primary-500 checked:border-primary-500',
              className
            )}
            {...props}
          />
          <Check
            className={cn(
              'absolute top-0.5 left-0.5 h-4 w-4 text-white pointer-events-none',
              'opacity-0 peer-checked:opacity-100 transition-opacity'
            )}
          />
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className="text-sm font-medium text-foreground cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
