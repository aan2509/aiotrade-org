"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function useLightLandingMotion() {
  const prefersReducedMotion = useReducedMotion();
  const [isSmallViewport, setIsSmallViewport] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const syncViewport = () => setIsSmallViewport(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => {
      mediaQuery.removeEventListener("change", syncViewport);
    };
  }, []);

  return prefersReducedMotion || isSmallViewport;
}
