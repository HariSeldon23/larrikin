import { useState, useEffect, useRef } from 'react';

export function useCountUp(
  target: number,
  duration: number = 1500,
  startOnView: boolean = true,
): { value: number; ref: React.RefObject<HTMLElement | null> } {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLElement | null>(null);
  const hasBeenVisible = useRef(false);
  const prevTarget = useRef(target);

  useEffect(() => {
    const from = prevTarget.current !== target ? prevTarget.current : 0;
    prevTarget.current = target;

    if (!startOnView || hasBeenVisible.current) {
      // Already visible or no view gating — animate immediately
      animateFromTo(from, target);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasBeenVisible.current = true;
          animateFromTo(0, target);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, startOnView]);

  function animateFromTo(from: number, to: number) {
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + eased * (to - from)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  return { value, ref };
}
