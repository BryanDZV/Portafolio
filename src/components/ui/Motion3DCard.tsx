"use client";

import { type MouseEvent, type ReactNode, useRef } from "react";
import {
  m,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

interface Motion3DCardProps {
  children: ReactNode;
  className?: string;
  reduceMotion?: boolean;
}

export function Motion3DCard({
  children,
  className = "",
  reduceMotion: reduceMotionProp,
}: Motion3DCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const motionPreference = useReducedMotion() ?? false;
  const reduceMotion = reduceMotionProp ?? motionPreference;

  // mouseX y mouseY se usan SOLO para el aura de luz (requiere píxeles reales).
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  //  normX y normY se usarán para la rotación (requiere porcentaje -0.5 a 0.5).
  // Esto arregla el salto brusco ("pum") al entrar a la carta.
  const normX = useMotionValue(0);
  const normY = useMotionValue(0);

  // UX 3D: el cursor controla inclinación y luz para crear profundidad real, sin hacks visuales.
  //  Mismas físicas exactas que en `use3DTilt.ts` para que no haya retrasos
  const springConfig = { stiffness: 600, damping: 15, mass: 0.05 };

  // Aplicamos el spring a los valores normalizados
  const springX = useSpring(normX, springConfig);
  const springY = useSpring(normY, springConfig);

  const rotateX = useTransform(springY, [-0.15, 0.15], [15, -15]);
  const rotateY = useTransform(springX, [-0.15, 0.15], [-15, 15]);

  const spotlight = useMotionTemplate`
    radial-gradient(
      420px circle at ${mouseX}px ${mouseY}px,
      rgba(120, 0, 255, 0.18),
      transparent 78%
    )
  `;

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    if (reduceMotion) return;

    const rect = currentTarget.getBoundingClientRect();
    const rawX = clientX - rect.left;
    const rawY = clientY - rect.top;

    // Actualizamos la luz con píxeles reales
    mouseX.set(rawX);
    mouseY.set(rawY);

    // Actualizamos la rotación con porcentajes proporcionales
    normX.set(rawX / rect.width - 0.5);
    normY.set(rawY / rect.height - 0.5);
  }

  function handleMouseLeave() {
    // Al salir, la luz se esconde y la rotación vuelve a 0 suavemente
    mouseX.set(0);
    mouseY.set(0);
    normX.set(0);
    normY.set(0);
  }

  return (
    <m.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: reduceMotion ? 0 : 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        perspective: 1200,
        rotateX: reduceMotion ? 0 : rotateX,
        rotateY: reduceMotion ? 0 : rotateY,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className={`group relative overflow-hidden border border-border rounded-3xl bg-card/70 backdrop-blur-md shadow-2xl pointer-events-auto ${className}`}
    >
      {/* Capa de luz: patrón oficial usando \`useMotionTemplate\` y motion values. */}
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />

      <div className="relative z-10 h-full">{children}</div>
    </m.div>
  );
}
