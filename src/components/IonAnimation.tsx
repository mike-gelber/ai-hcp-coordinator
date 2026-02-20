"use client";

import { useEffect, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web";

export default function IonAnimation({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current || animRef.current) return;

    animRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/ion-animation.json",
    });

    return () => {
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className={className} />;
}
