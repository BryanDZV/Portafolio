"use client";

import type { ReactNode } from "react";
import { LazyMotion, domAnimation } from "framer-motion";

interface MotionProviderProps {
  children: ReactNode;
}

// QUE HACE: Inyecta el motor de animaciones de forma diferida (Lazy) en toda la aplicación.
// POR QUE SE ELIGIO: Usar el modo 'Lazy' en lugar del modo estándar reduce el tamaño del bundle de JavaScript inicial, lo que mejora directamente la nota de rendimiento (LCP y TBT) en Lighthouse.
// COMO FUNCIONA: Envuelve a todos los componentes hijos; cuando un componente usa 'm.div' (en lugar de 'motion.div'), este provider le suministra las funcionalidades de animación solo cuando son necesarias.
// APRENDE MAS: https://www.framer.com/motion/lazy-motion/
export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
