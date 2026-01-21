"use client";

import * as React from "react";
import { cn } from "./utils";

export interface InputProps {
  error?: boolean;
  icon?: any;
  className?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => void;
  disabled?: boolean;
  [key: string]: any;
}

const Input = React.forwardRef(
  ({ className, type, error, icon, ...props }: any, ref: any) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border bg-background-secondary px-3 py-2 text-sm text-foreground placeholder:text-foreground-subtle transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background focus:border-primary-500",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-error focus:ring-error"
              : "border-border hover:border-border-hover",
            icon && "pl-10",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
