"use client";

import { useEffect, useState } from "react";
import useMediaQuery from "./useMediaQuery";

/** Phones / tablets / touch devices get a lighter 3D setup (fewer lights, no env map). */
export function useLiteDevice() {
  return useMediaQuery("(pointer: coarse), (max-width: 1023px)");
}

/**
 * Becomes true once the page has loaded and the main thread is idle, so heavy work
 * (3D engine, avatar download, shader compilation) never competes with first paint.
 */
export function useIdleReady(extraDelay = 0) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let idleId: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const go = () => {
      timer = setTimeout(() => {
        const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
        if (ric) idleId = ric(() => setReady(true), { timeout: 2500 });
        else setReady(true);
      }, extraDelay);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    // safety net: never wait longer than this, even if "load"/idle callbacks are starved
    const failsafe = setTimeout(() => setReady(true), 6000 + extraDelay);
    return () => {
      clearTimeout(failsafe);
      window.removeEventListener("load", go);
      if (timer) clearTimeout(timer);
      const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (idleId && cic) cic(idleId);
    };
  }, [extraDelay]);
  return ready;
}

type NetInfo = { saveData?: boolean; effectiveType?: string };

/** Data Saver on, or a 2G/3G connection: skip optional heavy downloads until the visitor asks. */
export function useConstrainedNetwork() {
  const [constrained, setConstrained] = useState(false);
  useEffect(() => {
    const c = (navigator as Navigator & { connection?: NetInfo }).connection;
    if (!c) return;
    const id = requestAnimationFrame(() => setConstrained(!!c.saveData || /(^|-)2g|3g/.test(c.effectiveType || "")));
    return () => cancelAnimationFrame(id);
  }, []);
  return constrained;
}
