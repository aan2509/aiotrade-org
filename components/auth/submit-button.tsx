"use client";

import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";

type SubmitButtonProps = ButtonProps & {
  children: ReactNode;
  pendingText: string;
};

export function SubmitButton({
  children,
  pendingText,
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={disabled || pending} type="submit" {...props}>
      {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
      {pending ? pendingText : children}
    </Button>
  );
}
