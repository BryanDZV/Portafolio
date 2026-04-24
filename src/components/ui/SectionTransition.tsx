"use client";

import { m, useReducedMotion } from "framer-motion";
import { getInViewReveal } from "@/components/ui/motion-presets";

interface SectionTransitionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function SectionTransition({
  children,
  delay = 0,
  className,
}: SectionTransitionProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const revealProps = getInViewReveal({
    shouldReduceMotion,
    delay,
    duration: 0.55,
    y: 24,
    rotateX: 8,
  });

  // Transición de sección con API oficial de Motion.
  // Docs oficial (Scroll animations + Variants):
  // https://motion.dev/docs/react-scroll-animations
  // https://motion.dev/motion/animation/#variants
  return (
    <m.section
      initial={revealProps.initial}
      whileInView={revealProps.whileInView}
      viewport={{ once: true, margin: "-100px" }}
      transition={revealProps.transition}
      style={{ perspective: 1200, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </m.section>
  );
}
