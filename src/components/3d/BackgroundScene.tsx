"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { m } from "framer-motion";
import { useSplineManager } from "@/hooks/useSplineManager";

// QUE HACE: Carga el runtime 3D de Spline de forma diferida.
//hace que la importación de Spline sea dinámica y sin SSR, lo que significa que el código del motor 3D solo se descargará y ejecutará en el cliente cuando sea necesario. Esto mejora el rendimiento inicial de la página, especialmente en dispositivos móviles o conexiones lentas, al evitar cargar un paquete pesado que no es esencial para el primer renderizado.
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});

export function BackgroundScene() {
  // QUE HACE: carga desde el manager.
  // POR QUE SE ELIGIO: Limpia el componente visual de efectos secundarios, dejándolo enfocado exclusivamente en el renderizado.
  const {
    isLoaded,
    isTimeout,
    shouldInitializeSpline,
    shouldRenderSpline,
    sceneKey,
    onLoad,
  } = useSplineManager();

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-0 h-full w-full pointer-events-auto bg-background"
    >
      {/* 1. SKELETON: Mientras el motor 3D se prepara */}
      {shouldRenderSpline &&
        (!isLoaded || !shouldInitializeSpline) &&
        !isTimeout && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,0,255,0.14),transparent_70%)] animate-pulse" />
        )}

      {/* 2. MOTOR 3D: Cuando el hardware y el navegador dan luz verde */}
      {shouldRenderSpline && shouldInitializeSpline && !isTimeout ? (
        <Suspense fallback={null}>
          <Spline
            key={sceneKey}
            //scene="https://prod.spline.design/ezq7St0EnIj3D6Nk/scene.splinecode"
            scene="https://prod.spline.design/ezq7St0EnIj3D6Nk/scene.splinecode"
            style={{ width: "100%", height: "100%" }}
            onLoad={onLoad}
          />
        </Suspense>
      ) : null}

      {/* 3. FALLBACK: Para móviles, errores de red o ahorro de batería */}
      {(!shouldRenderSpline || isTimeout) && (
        <div className="h-full w-full opacity-30 bg-[radial-gradient(circle_at_center,var(--primary),transparent_70%)]" />
      )}
    </m.div>
  );
}
