"use client"

import * as React from "react"
import { CheckIcon, ClipboardIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"


interface CopyButtonProps extends ButtonProps {
  onCopy?: () => void
}

export function CopyButton({
  className,
  onCopy,
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  return (
    <Button
      size="icon"
      variant="outline"
      className={cn(
        "relative z-10 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50 [&_svg]:h-3 [&_svg]:w-3",
        className
      )}
      onClick={() => {
        onCopy?.()
        setHasCopied(true)
      }}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
    </Button>
  )
}