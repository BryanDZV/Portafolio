"use client";

import { useRef, useState, useEffect } from "react";
import { m, useInView, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedSplitTitleProps {
  as?: "h1" | "h2";
  line1: string;
  line2?: string;
  className?: string;
  line1ClassName?: string;
  line2ClassName?: string;
  viewportAmount?: number;
  loop?: boolean;
  loopDelayMs?: number;
}

export function AnimatedSplitTitle({
  as = "h2",
  line1,
  line2,
  className,
  line1ClassName,
  line2ClassName,
  viewportAmount = 0.8,
  loop = false,
  loopDelayMs = 4500,
}: AnimatedSplitTitleProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const MotionHeading = m[as];
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  // QUE HACE: Guardia de Hidratación (Hydration Guard).
  // POR QUE SE ELIGIO: Es el patrón oficial de React para manejar contenido que difiere entre el Servidor (SSR) y el Cliente (hidratación).
  // COMO FUNCIONA: Silenciamos temporalmente la advertencia del linter para forzar un render en cascada seguro. Así evitamos el "Flicker" (parpadeo) del LCP.
  // APRENDE MAS: https://react.dev/reference/react-dom/client/hydrateRoot
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // QUE HACE: Define orquestación de entrada para contenedor y letras con control de stagger.
  // POR QUE SE ELIGIO: Separar variantes permite un tuning fino del timing en componentes hijos.
  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  // QUE HACE: Define variantes de caracteres optimizadas para composición de GPU.
  // POR QUE SE ELIGIO: Eliminar `filter: blur()` reduce drásticamente las invalidaciones de pintura y estabiliza el Hilo Principal (Main Thread) en dispositivos móviles.
  const letterVariants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: [0.2, 0.65, 0.3, 0.9] as const,
      },
    },
  };

  // ==========================================
  // 1. SSR Render (Evita el LCP flicker)
  // ==========================================
  // QUE HACE: Renderiza HTML estático en el servidor.
  // POR QUE SE ELIGIO: Garantiza que Lighthouse y el navegador vean el texto instantáneamente, manteniendo el LCP en un estado óptimo.
  if (!isMounted) {
    const HeadingTag = as;
    return (
      <HeadingTag className={cn("leading-relaxed", className)}>
        <span className={cn("inline-block", line1ClassName)}>{line1}</span>
        {line2 && (
          <>
            <br />
            <span className={cn("inline-block mt-2", line2ClassName)}>
              {line2}
            </span>
          </>
        )}
      </HeadingTag>
    );
  }

  // ==========================================
  // 2. Client Render (Animación)
  // ==========================================
  // QUE HACE: Renderiza el componente interactivo bifurcando la lógica si requiere un loop infinito.
  // POR QUE SE ELIGIO: Aísla el hack del `key` para el loop, permitiendo que los elementos normales o "sticky" usen el comportamiento nativo `whileInView` sin desaparecer de la pantalla.
  return loop ? (
    <LoopingTitle
      MotionHeading={MotionHeading}
      textContainerVariants={textContainerVariants}
      letterVariants={letterVariants}
      line1={line1}
      line2={line2}
      className={className}
      line1ClassName={line1ClassName}
      line2ClassName={line2ClassName}
      loopDelayMs={loopDelayMs}
      viewportAmount={viewportAmount}
    />
  ) : (
    <MotionHeading
      ref={headingRef}
      variants={textContainerVariants}
      initial="hidden"
      // whileInView garantiza que la animación se repita cada vez que entra en pantalla
      whileInView="visible"
      viewport={{ once: false, amount: viewportAmount }}
      className={cn("leading-relaxed", className)}
    >
      <TitleContent
        line1={line1}
        line2={line2}
        line1ClassName={line1ClassName}
        line2ClassName={line2ClassName}
        letterVariants={letterVariants}
      />
    </MotionHeading>
  );
}

// ==========================================
// SUBCOMPONENTES (Tipados y Aislados)
// ==========================================

interface TitleContentProps {
  line1: string;
  line2?: string;
  line1ClassName?: string;
  line2ClassName?: string;
  letterVariants: Variants;
}

function TitleContent({
  line1,
  line2,
  line1ClassName,
  line2ClassName,
  letterVariants,
}: TitleContentProps) {
  return (
    <>
      <span className={cn("inline-block", line1ClassName)}>
        {line1.split("").map((char: string, index: number) => (
          <m.span
            key={`line1-${index}`}
            variants={letterVariants}
            className="inline-block p-2 -m-2"
          >
            {char === " " ? "\u00A0" : char}
          </m.span>
        ))}
      </span>

      {line2 && (
        <>
          <br />
          <span className={cn("inline-block mt-2", line2ClassName)}>
            {line2.split("").map((char: string, index: number) => (
              <m.span
                key={`line2-${index}`}
                variants={letterVariants}
                // QUE HACE: Añade padding y margen negativo para compensar el bounding box de las letras.
                // POR QUE SE ELIGIO: Evita que el texto con gradiente se "corte" en los bordes durante la animación (Glitch visual de webkit).
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400 p-3.5 -m-2"
              >
                {char === " " ? "\u00A0" : char}
              </m.span>
            ))}
          </span>
        </>
      )}
    </>
  );
}

interface LoopingTitleProps extends TitleContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MotionHeading: any;
  textContainerVariants: Variants;
  className?: string;
  loopDelayMs: number;
  viewportAmount: number;
}

function LoopingTitle({
  MotionHeading,
  textContainerVariants,
  letterVariants,
  line1,
  line2,
  className,
  line1ClassName,
  line2ClassName,
  loopDelayMs,
  viewportAmount,
}: LoopingTitleProps) {
  // QUE HACE: Gestiona el ciclo infinito de destrucción/creación del componente final (HABLEMOS).
  // POR QUE SE ELIGIO: Al cambiar el React `key`, forzamos al motor interno a desmontar y volver a montar el componente, reiniciando la animación de cero sin fallos de estado.
  const [cycle, setCycle] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: viewportAmount });

  useEffect(() => {
    if (!isInView) return;
    const interval = window.setInterval(() => {
      setCycle((c) => c + 1);
    }, loopDelayMs);
    return () => window.clearInterval(interval);
  }, [isInView, loopDelayMs]);

  return (
    <MotionHeading
      ref={ref}
      key={cycle}
      variants={textContainerVariants}
      initial="hidden"
      animate="visible"
      className={cn("leading-relaxed", className)}
    >
      <TitleContent
        line1={line1}
        line2={line2}
        line1ClassName={line1ClassName}
        line2ClassName={line2ClassName}
        letterVariants={letterVariants}
      />
    </MotionHeading>
  );
}
