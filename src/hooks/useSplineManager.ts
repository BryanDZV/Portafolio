import { useState, useEffect, useCallback } from "react";
import { useReducedMotion } from "framer-motion";

// QUE HACE: Gestiona el ciclo de vida complejo de un motor 3D (Spline), incluyendo detección de hardware y optimización de CPU.
// POR QUE SE ELIGIO: Centralizar la lógica de "carga inteligente" permite que el componente visual sea más legible y reutilizable.
// COMO FUNCIONA: Monitorea el ancho de banda/pantalla, espera a que la CPU esté libre (Idle) y maneja fallos de carga (timeout).
export function useSplineManager() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const [shouldInitializeSpline, setShouldInitializeSpline] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [sceneKey, setSceneKey] = useState(0);

  // 1. DETECCIÓN DE DISPOSITIVO  si es movil o ahorrador de bateria, no renderiza el spline
  useEffect(() => {
    const checkDevice = () => {
      // Usamos requestAnimationFrame para evitar el error de "cascading renders"
      requestAnimationFrame(() => {
        setIsDesktop(window.innerWidth >= 768);
      });
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const shouldRenderSpline = !shouldReduceMotion && isDesktop;

  // 2. INICIALIZACIÓN EN IDLE  Espera a que la CPU esté libre para iniciar el motor 3D,
  //  evitando basura en el hilo principal durante la carga de la página.
  useEffect(() => {
    if (!shouldRenderSpline) return;

    const startInitialization = () => setShouldInitializeSpline(true);
    let idleId: number;
    let timeoutId: NodeJS.Timeout;

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(startInitialization, {
        timeout: 2000,
      });
    } else {
      timeoutId = setTimeout(startInitialization, 1500);
    }

    return () => {
      if (idleId) window.cancelIdleCallback(idleId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [shouldRenderSpline]);

  // 3. WATCHDOG si el motor 3D no carga en 5 segundos, asumimos que algo salió mal (ej. red lenta) y
  // mostramos un fallback en lugar de dejar un skeleton infinito.
  useEffect(() => {
    if (!shouldRenderSpline || !shouldInitializeSpline) return;
    const timer = setTimeout(() => {
      if (!isLoaded) setIsTimeout(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isLoaded, shouldRenderSpline, shouldInitializeSpline]);

  // 4. BFCache reinicia el motor 3D si el usuario vuelve a la página usando el botón de atrás,
  //  asegurando que siempre se intente cargar el spline en cada visita.
  useEffect(() => {
    if (!shouldRenderSpline) return;
    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      setIsLoaded(false);
      setIsTimeout(false);
      setShouldInitializeSpline(false);
      setSceneKey((prev) => prev + 1);
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [shouldRenderSpline]);

  const onLoad = useCallback(() => setIsLoaded(true), []);

  return {
    isLoaded,
    isTimeout,
    shouldInitializeSpline,
    shouldRenderSpline,
    sceneKey,
    onLoad,
  };
}
