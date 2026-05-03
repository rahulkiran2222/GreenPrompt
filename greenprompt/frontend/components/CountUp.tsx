"use client";
import { useEffect, useState } from "react";

export default function CountUp({ value, decimals = 4, duration = 800 }: {
  value: number; decimals?: number; duration?: number;
}) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf: number; const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setV(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <span>{v.toFixed(decimals)}</span>;
}