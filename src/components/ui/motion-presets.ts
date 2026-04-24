import type { Transition } from "framer-motion";

export const STANDARD_EASE = [0.22, 1, 0.36, 1] as const;

interface InViewRevealConfig {
  shouldReduceMotion: boolean;
  delay?: number;
  duration?: number;
  y?: number;
  rotateX?: number;
}

// QUE HACE: Centraliza presets de reveal para entradas `whileInView` usadas en secciones y bloques reutilizables.
// POR QUE SE ELIGIO: Consolidar parámetros de animación reduce duplicación y evita deriva visual entre componentes.
// COMO FUNCIONA: Construye `initial`, `whileInView` y `transition` en función de `prefers-reduced-motion` y valores configurables.
// APRENDE MAS: https://motion.dev/docs/react-scroll-animations y https://motion.dev/motion/animation/#variants
export function getInViewReveal({
  shouldReduceMotion,
  delay = 0,
  duration = 0.5,
  y = 18,
  rotateX,
}: InViewRevealConfig) {
  const initialTransform = {
    opacity: 0,
    y,
    ...(rotateX !== undefined ? { rotateX } : {}),
  };

  const revealTransform = {
    opacity: 1,
    y: 0,
    ...(rotateX !== undefined ? { rotateX: 0 } : {}),
  };

  const transition: Transition = {
    duration: shouldReduceMotion ? 0 : duration,
    delay: shouldReduceMotion ? 0 : delay,
    ease: STANDARD_EASE,
  };

  return {
    initial: shouldReduceMotion ? false : initialTransform,
    whileInView: shouldReduceMotion ? undefined : revealTransform,
    transition,
  };
}
// Añade esto a tu archivo de presets existente
export const STAGGER_CONTAINER = (
  shouldReduceMotion: boolean,
  stagger = 0.06,
) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: shouldReduceMotion ? 0 : 0.45,
      ease: [0.22, 1, 0.36, 1] as const, // para evitar error de typescript con framer-motion que no reconoce el tipo de easing personalizado
      staggerChildren: shouldReduceMotion ? 0 : stagger,
    },
  },
});

export const FADE_UP_ITEM = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};
