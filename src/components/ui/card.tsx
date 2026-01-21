"use client";

import * as React from "react";
import { cn } from "./utils";

interface CardProps {
  className?: string;
  children?: any;
  [key: string]: any;
}

const Card = React.forwardRef(
  ({ className, ...props }: CardProps, ref: any) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg bg-background-secondary border border-border transition-all duration-300 hover:border-border-hover hover:shadow-glow-sm",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef(
  ({ className, ...props }: CardProps, ref: any) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(
  ({ className, ...props }: CardProps, ref: any) => (
    <h3
      ref={ref}
      className={cn(
        "text-xl font-semibold leading-none tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(
  ({ className, ...props }: CardProps, ref: any) => (
    <p
      ref={ref}
      className={cn("text-sm text-foreground-muted", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(
  ({ className, ...props }: CardProps, ref: any) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(
  ({ className, ...props }: CardProps, ref: any) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
