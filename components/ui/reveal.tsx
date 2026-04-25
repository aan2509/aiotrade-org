"use client";

import { useEffect, useMemo, useRef, type PropsWithChildren } from "react";
import {
  motion,
  useAnimationControls,
  useInView,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right";

type RevealProps = PropsWithChildren<
  Omit<HTMLMotionProps<"div">, "initial" | "transition" | "whileHover" | "whileInView" | "viewport"> & {
    amount?: number;
    delay?: number;
    direction?: Direction;
    distance?: number;
    duration?: number;
    hover?: boolean;
    once?: boolean;
    stable?: boolean;
  }
>;

function getInitialPosition(direction: Direction, distance: number) {
  switch (direction) {
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
    case "up":
    default:
      return { y: distance };
  }
}

export function Reveal({
  amount = 0.2,
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 24,
  duration = 1.12,
  hover = false,
  once = false,
  stable = false,
  ...props
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const controls = useAnimationControls();
  const isInView = useInView(ref, { amount, once });
  const initialPosition = getInitialPosition(direction, distance);
  const hiddenState = useMemo(
    () =>
      prefersReducedMotion
        ? { opacity: 1, x: 0, y: 0 }
        : { opacity: stable ? 1 : 0, ...initialPosition },
    [initialPosition, prefersReducedMotion, stable],
  );
  const visibleState = useMemo(() => ({ opacity: 1, x: 0, y: 0 }), []);

  useEffect(() => {
    controls.start(isInView || prefersReducedMotion ? visibleState : hiddenState);
  }, [controls, hiddenState, isInView, prefersReducedMotion, visibleState]);

  return (
    <motion.div
      animate={controls}
      className={cn(className)}
      initial={hiddenState}
      ref={ref}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={
        hover && !prefersReducedMotion
          ? { y: -6, scale: 1.01, transition: { duration: 0.34 } }
          : undefined
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}
