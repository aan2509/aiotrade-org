import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-600 text-white hover:bg-emerald-700",
        secondary:
          "bg-stone-900 text-white hover:bg-stone-800",
        outline:
          "border border-stone-300 bg-white text-stone-900 hover:bg-stone-50",
        ghost:
          "text-stone-700 hover:bg-stone-100",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        type={type}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
