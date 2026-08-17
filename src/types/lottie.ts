// src/types/lottie.ts

export interface LottieProps {
  animationData: unknown; // Recibe el JSON de la animación
  className?: string; // Clases de Tailwind para el contenedor
  loop?: boolean; // Controla si se repite (por defecto true)
  autoplay?: boolean; // Controla si inicia sola (por defecto true)
}
