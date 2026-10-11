"use client";

import { useCallback, useEffect, useState } from "react";

/** N random slots reshuffled from a pool at an interval. SSR-safe: starts with a fixed slice, reshuffles only after mount. */
export function useRotatingSlots(pool: string[], slotCount: number, intervalMs: number) {
  const [slots, setSlots] = useState<string[]>(() => pool.slice(0, slotCount));
  const [mounted, setMounted] = useState(false);

  const reshuffle = useCallback(() => {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setSlots(shuffled.slice(0, slotCount));
  }, [pool, slotCount]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    reshuffle();
    const t = setInterval(reshuffle, intervalMs);
    return () => clearInterval(t);
  }, [mounted, intervalMs, reshuffle]);

  return slots;
}

/** Single index that advances through a pool at an interval — for crossfade / cycling text. */
export function useCyclingIndex(length: number, intervalMs: number) {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % length), intervalMs);
    return () => clearInterval(t);
  }, [mounted, length, intervalMs]);

  return index;
}
