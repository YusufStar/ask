import { VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import { Avatar, AvatarFallback, AvatarImage, avatarVariants } from "./avatar";
import { cn } from "@/lib/utils";

const avatarStackVariants = cva("flex", {
  variants: {
    variant: {
      default: "gap-1",
      stack: "hover:space-x-1.5 -space-x-1 rtl:space-x-reverse", // üst üste binme yarıya indirildi
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface AvatarStackProps
  extends React.HTMLAttributes<HTMLDivElement>,
  Pick<VariantProps<typeof avatarVariants>, `size`>,
  VariantProps<typeof avatarStackVariants> {
  id: string;
  avatars: { url?: string; name: string }[];
  maxAvatarsAmount?: number;
}

function AvatarStack({
  id,
  className,
  avatars,
  variant,
  size,
  maxAvatarsAmount = 4,
  ...props
}: AvatarStackProps) {
  const limitedAvatars = avatars.slice(0, maxAvatarsAmount);
  return (
    <div className={cn(avatarStackVariants({ variant }), className)} {...props}>
      {limitedAvatars.slice(0, maxAvatarsAmount).map((avatar, index) => (
        <Avatar size={size} key={`${id}-${index}`} className={
          cn(
            `-ml-${index * 2} rtl:-mr-${index * 2}`,
          )
        }>
          <AvatarImage src={avatar.url} />
          <AvatarFallback>
            {avatar.name
              .split(" ")
              .reduce((acc, subName) => acc + subName[0], "")}
          </AvatarFallback>
        </Avatar>
      ))}
      {limitedAvatars.length < avatars.length && (
        <Avatar size={size}>
          <AvatarFallback className="text-primary">
            +{avatars.length - limitedAvatars.length}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

export { AvatarStack };
