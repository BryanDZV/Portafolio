"use client";

import * as React from "react";
import { useThemeStore } from "@/store/useThemeStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isDark = useThemeStore((state) => state.isDark);

  React.useEffect(() => {
    // QUE HACE: Sincroniza la clase .dark con el estado de Zustand.
    // POR QUE SE ELIGIO: toggle() con el segundo parámetro es la forma más limpia y libre de errores de añadir/quitar clases.
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return <>{children}</>;
}
