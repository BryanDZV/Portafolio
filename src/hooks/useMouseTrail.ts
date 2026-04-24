import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring, useReducedMotion } from "framer-motion";

// QUE HACE: Encapsula toda la lógica matemática, físicas y listeners del cursor personalizado.
// POR QUE SE ELIGIO: Separar la lógica (físicas) de la vista (HTML) cumple con el Principio de Responsabilidad Única. Hace el componente visual más limpio y permite reutilizar este hook en el futuro.
// COMO FUNCIONA: Gestiona estados internos y expone un objeto solo con las coordenadas finales calculadas por los 'springs' para que la interfaz las consuma.
// APRENDE MAS: https://react.dev/learn/reusing-logic-with-custom-hooks
export function useMouseTrail() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const isVisibleRef = useRef(false);

  // QUE HACE: Crea fuentes de verdad para la posición del puntero fuera del ciclo de render de React.
  // POR QUE SE ELIGIO: useMotionValue evita re-renderizados constantes por cada pixel que se mueve el ratón, salvando el rendimiento de la CPU.
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // QUE HACE: Aplica físicas de muelle (Spring) a las coordenadas del ratón.
  // POR QUE SE ELIGIO: En lugar de seguir al ratón instantáneamente (lo cual se ve robótico), añade masa y fricción para crear un efecto de "estela" u "órbita" orgánica.
  // COMO FUNCIONA: Al variar el 'stiffness' (rigidez) y 'mass' (masa) entre las capas, las bolas más pesadas tardan más en llegar al destino, creando el rastro temporal.
  // APRENDE MAS: https://motion.dev/docs/react-use-spring
  const spotlightX = useSpring(mouseX, {
    stiffness: 500,
    damping: 30,
    mass: 0.5,
  });
  const spotlightY = useSpring(mouseY, {
    stiffness: 500,
    damping: 30,
    mass: 0.5,
  });

  const trail1X = useSpring(mouseX, { stiffness: 200, damping: 20, mass: 0.5 });
  const trail1Y = useSpring(mouseY, { stiffness: 200, damping: 20, mass: 0.5 });

  const trail2X = useSpring(mouseX, { stiffness: 100, damping: 15, mass: 0.8 });
  const trail2Y = useSpring(mouseY, { stiffness: 100, damping: 15, mass: 0.8 });

  const trail3X = useSpring(mouseX, { stiffness: 50, damping: 10, mass: 1.2 });
  const trail3Y = useSpring(mouseY, { stiffness: 50, damping: 10, mass: 1.2 });

  const trail4X = useSpring(mouseX, { stiffness: 30, damping: 9, mass: 1.6 });
  const trail4Y = useSpring(mouseY, { stiffness: 30, damping: 9, mass: 1.6 });

  useEffect(() => {
    // QUE HACE: Sincroniza una marca global en el HTML para ocultar el cursor nativo de Windows/Mac.
    // POR QUE SE ELIGIO: Evitamos ocultar el cursor original si el componente falla o si el usuario prefiere "movimiento reducido".
    const rootElement = document.documentElement;
    const isCursorEnabled = !shouldReduceMotion && isReady;

    if (isCursorEnabled) {
      rootElement.classList.add("custom-cursor-enabled");
    } else {
      rootElement.classList.remove("custom-cursor-enabled");
    }
    return () => rootElement.classList.remove("custom-cursor-enabled");
  }, [isReady, shouldReduceMotion]);

  useEffect(() => {
    // QUE HACE: Retrasa la activación matemática del cursor hasta que la web ha terminado de cargar lo importante.
    // POR QUE SE ELIGIO: requestIdleCallback ejecuta este código pesado solo cuando el procesador del móvil está "aburrido" (idle). Salva el Total Blocking Time (TBT).
    // APRENDE MAS: https://developer.mozilla.org/docs/Web/API/Window/requestIdleCallback
    if (shouldReduceMotion) return;

    let timeoutId: number | undefined;
    let idleId: number | undefined;
    let didSetReady = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const windowWithIdleApi = window as any;

    const setReady = () => {
      if (!didSetReady) {
        didSetReady = true;
        setIsReady(true);
      }
    };

    const fallbackTimeoutId = window.setTimeout(setReady, 1200);

    if (typeof windowWithIdleApi.requestIdleCallback === "function") {
      idleId = windowWithIdleApi.requestIdleCallback(setReady, {
        timeout: 1200,
      });
    } else {
      timeoutId = window.setTimeout(setReady, 150);
    }

    return () => {
      if (
        idleId !== undefined &&
        typeof windowWithIdleApi.cancelIdleCallback === "function"
      ) {
        windowWithIdleApi.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      window.clearTimeout(fallbackTimeoutId);
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    // QUE HACE: Escucha los movimientos reales del hardware (ratón) del usuario.
    // POR QUE SE ELIGIO: Se registran eventos nativos del navegador por eficiencia, y solo se actualiza React cuando el cursor entra o sale de la ventana.
    if (shouldReduceMotion || !isReady) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      if (isVisibleRef.current) {
        isVisibleRef.current = false;
        setIsVisible(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave,
      );
    };
  }, [isReady, mouseX, mouseY, shouldReduceMotion]);

  // Retornamos el objeto limpio para que el componente visual lo lea.
  return {
    isReady,
    isVisible,
    shouldReduceMotion,
    spotlight: { x: spotlightX, y: spotlightY },
    trail1: { x: trail1X, y: trail1Y },
    trail2: { x: trail2X, y: trail2Y },
    trail3: { x: trail3X, y: trail3Y },
    trail4: { x: trail4X, y: trail4Y },
  };
}
