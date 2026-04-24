"use client";

import { m } from "framer-motion";
import { useMouseTrail } from "@/hooks/useMouseTrail";
import { useState, useEffect } from "react";

export function CustomCursor() {
  // QUE HACE: Consume las coordenadas con los 4 trails
  const {
    isReady,
    isVisible,
    shouldReduceMotion,
    spotlight,
    trail1,
    trail2,
    trail3,
    trail4,
  } = useMouseTrail();

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Detección global para toda la web
      if (
        target?.closest(
          'a, button, input, [role="button"], [data-cursor="pointer"]',
        )
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mouseover", handleMouseOver);
    return () => window.removeEventListener("mouseover", handleMouseOver);
  }, []);

  if (shouldReduceMotion || !isReady) return null;

  // 🚨 CAMBIO AQUÍ: ¡Colores exactamente como querías!
  // Morado siempre (default), Azul/Cyan en clicables (hover)
  const coreVariants = {
    default: {
      scale: 1,
      backgroundColor: "rgba(120, 0, 255, 0.9)", // Morado
      boxShadow: "0 0 15px rgba(120, 0, 255, 1)",
    },
    hover: {
      scale: 1.8,
      backgroundColor: "rgba(34, 211, 238, 1)", // Azul/Cyan
      boxShadow: "0 0 25px rgba(34, 211, 238, 0.8)",
    },
  };

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
      style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.3s ease" }}
    >
      {/* Halo principal (Fondo degradado morado y azul) */}
      <m.div
        style={spotlight}
        animate={{ scale: isHovering ? 1.2 : 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="absolute top-0 left-0 -ml-[175px] -mt-[175px] w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(120,0,255,0.35)_0%,rgba(34,211,238,0.15)_40%,transparent_70%)] mix-blend-plus-lighter blur-2xl"
      />

      {/* ESTELA 4: El círculo nuevo, el más pequeñito y alejado (Cyan oscuro) */}
      {trail4 && (
        <m.div
          style={trail4}
          animate={{ scale: isHovering ? 1.2 : 1 }}
          className="absolute top-0 left-0 -ml-[2px] -mt-[2px] w-1 h-1 bg-cyan-600/40 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.4)]"
        />
      )}

      {/* ESTELA 3: Azul/Cyan medio */}
      <m.div
        style={trail3}
        animate={{ scale: isHovering ? 1.4 : 1 }}
        className="absolute top-0 left-0 -ml-1 -mt-1 w-2 h-2 bg-cyan-400/50 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.7)]"
      />

      {/* ESTELA 2: Morado acompañando a la cabeza */}
      <m.div
        style={trail2}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.9 : 0.7,
        }}
        className="absolute top-0 left-0 -ml-[6px] -mt-[6px] w-3 h-3 bg-purple-400/70 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.8)]"
      />

      {/* NÚCLEO: Cabeza (Morado -> Azul al hacer hover) */}
      <m.div
        style={trail1}
        animate={isHovering ? "hover" : "default"}
        variants={coreVariants}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute top-0 left-0 -ml-2 -mt-2 w-4 h-4 rounded-full"
      />
    </div>
  );
}
