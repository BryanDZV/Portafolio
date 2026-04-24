import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ThemeState {
  isDark: boolean;
  setTheme: (isDark: boolean) => void;
  toggleTheme: () => void;
}

// QUE HACE: Define el almacén de datos (Store) para el estado visual de la aplicación.
// POR QUE SE ELIGIO: Zustand permite un estado global fuera del árbol de React, lo que evita renderizados innecesarios y facilita el acceso desde cualquier componente.
// COMO FUNCIONA: Gestiona la variable 'isDark' y proporciona funciones para cambiarla. La persistencia se encarga de guardarlo en LocalStorage automáticamente.
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Iniciamos en true (Dark por defecto es tendencia en 2026)
      isDark: true,

      // QUE HACE: Cambia el estado a un valor específico.
      // POR QUE SE ELIGIO: Permite forzar un tema (útil para botones de "Reset" o configuraciones de sistema).
      setTheme: (isDark) => set({ isDark }),

      // QUE HACE: Invierte el valor actual del tema.
      // POR QUE SE ELIGIO: Centraliza la lógica de alternancia para que los botones de la UI sean lo más sencillos posible.
      toggleTheme: () => set({ isDark: !get().isDark }),
    }),
    {
      name: "portfolio-theme",
      storage: createJSONStorage(() => localStorage),
      // Solo persistimos el valor booleano, ignorando las funciones.
      partialize: (state) => ({ isDark: state.isDark }),
    },
  ),
);
