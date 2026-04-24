"use client";

import { m, useReducedMotion } from "framer-motion";
import { getInViewReveal } from "@/components/ui/motion-presets";

interface AnimatedFadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedFadeIn({
  children,
  className,
  delay = 0,
}: AnimatedFadeInProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const revealProps = getInViewReveal({
    shouldReduceMotion,
    delay,
    duration: 0.5,
    y: 18,
  });

  return (
    <m.div
      // UX Motion System: wrapper reutilizable para animar bloques en páginas server.
      // Docs oficial: https://motion.dev/docs/react-animation
      initial={revealProps.initial}
      whileInView={revealProps.whileInView}
      viewport={{ once: true, margin: "-80px" }}
      transition={revealProps.transition}
      className={className}
    >
      {children}
    </m.div>
  );
}
