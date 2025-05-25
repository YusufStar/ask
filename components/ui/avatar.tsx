"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";

import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        lg: "h-10 w-10 min-w-10 min-h-10",
        md: "h-8 w-8 min-w-8 min-h-8",
        sm: "h-5 w-5 min-w-5 min-h-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> &
    VariantProps<typeof avatarVariants>
>(({ className, size, ...props }, ref) => (
  <AvatarPrimitive.Root
    style={{
      // eslint-disable-next-line no-nested-ternary -- tailwind bad config
      fontSize: size === "sm" ? "0.5rem" : size === "md" ? "0.75rem" : "1rem",
    }}
    ref={ref}
    className={cn(avatarVariants({ className, size }), className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarFallback, AvatarImage };
