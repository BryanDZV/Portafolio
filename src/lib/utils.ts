import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// QUE HACE: Normaliza y fusiona clases CSS condicionales para componentes UI.
// POR QUE SE ELIGIO: Un helper único evita duplicación, reduce errores de clases conflictivas y mejora legibilidad.
// COMO FUNCIONA: `clsx` construye la lista final y `twMerge` resuelve colisiones de utilidades Tailwind en tiempo de ejecución.
// APRENDE MAS: https://github.com/lukeed/clsx y https://github.com/dcastil/tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
