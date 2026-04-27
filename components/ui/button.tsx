import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-150 cursor-pointer disabled:pointer-events-none disabled:opacity-40 outline-none focus-visible:ring-1 focus-visible:ring-white/30",
  {
    variants: {
      variant: {
        primary: "bg-white text-black hover:bg-white/90 active:scale-[0.98] rounded-full",
        ghost:   "border border-white/10 text-white hover:bg-white/8 hover:border-white/20 rounded-full",
        subtle:  "text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg",
        link:    "text-muted-foreground hover:text-foreground underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 text-sm",
        lg: "h-10 px-6 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
