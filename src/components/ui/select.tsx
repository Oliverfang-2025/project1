import * as React from 'react';
import { cn } from './utils';

export interface SelectProps {
  options?: { value: string; label: string }[];
  className?: string;
  value?: string;
  onChange?: (e: any) => void;
  disabled?: boolean;
  children?: any;
  [key: string]: any;
}

const Select = React.forwardRef(
  ({ className, options = [], children, ...props }: any, ref: any) => {
    return (
      <select
        className={cn(
          'flex h-10 w-full rounded-lg border border-border bg-background-secondary px-3 py-2',
          'text-sm text-foreground',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-all appearance-none cursor-pointer',
          'bg-[url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")]',
          'bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10',
          className
        )}
        ref={ref}
        {...props}
      >
        {options.length > 0
          ? options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          : children}
      </select>
    );
  }
);

Select.displayName = 'Select';

export { Select };
