import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva("rounded-lg border px-4 py-3 text-sm", {
  variants: {
    variant: {
      default: "border-stone-200 bg-stone-50 text-stone-700",
      error: "border-rose-200 bg-rose-50 text-rose-700",
      success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type AlertProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants>;

function Alert({ className, variant, ...props }: AlertProps) {
  return <div className={cn(alertVariants({ variant }), className)} {...props} />;
}

export { Alert };
