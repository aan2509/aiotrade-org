import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-11 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        ref={ref}
        type={type}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
