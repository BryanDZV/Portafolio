import { useRef } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

export function use3DTilt(
  // stiffness alto (300) para que reaccione rápido y siga al ratón al instante.
  // damping alto (30) para frenar en seco sin que haya rebote ("clik" o vibración).
  // mass muy baja (0.1) para que no tenga inercia pesada (
  springConfig = { stiffness: 600, damping: 15, mass: 0.05 },
  tiltStrength = 20, // fuerza máxima para que no sea tan agresivo visualmente
) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Usamos el spring con la configuración ajustada para un "seguimiento directo y fluido"
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [tiltStrength, -tiltStrength],
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [-tiltStrength, tiltStrength],
  );

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, rotateX, rotateY, onMouseMove, onMouseLeave };
}
