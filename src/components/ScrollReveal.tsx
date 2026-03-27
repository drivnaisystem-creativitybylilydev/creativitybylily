'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** 0–1: portion of element visible before revealing */
  threshold?: number;
};

/**
 * Fades and slides content in when it enters the viewport, out when it leaves
 * (IntersectionObserver). Respects prefers-reduced-motion.
 */
export default function ScrollReveal({ children, className = '', threshold = 0.12 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={[
        'transform-gpu transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'motion-reduce:transition-none motion-reduce:duration-0',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
        'motion-reduce:opacity-100 motion-reduce:translate-y-0',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
