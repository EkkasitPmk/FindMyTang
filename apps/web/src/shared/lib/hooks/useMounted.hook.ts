"use client";
import { useState, useEffect } from "react";

let globalHydrated = false;

export const useMounted = () => {
  const [mounted, setMounted] = useState(globalHydrated);

  useEffect(() => {
    if (!globalHydrated) {
      const id = requestAnimationFrame(() => {
        globalHydrated = true;
        setMounted(true);
      });
      return () => cancelAnimationFrame(id);
    }
  }, []);

  return mounted;
};
