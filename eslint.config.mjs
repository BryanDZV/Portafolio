import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// QUE HACE: Combina reglas recomendadas de Next para web vitals y TypeScript en una sola configuración unificada.
// POR QUE SE ELIGIO: La composición por capas evita duplicar presets y mantiene un baseline de calidad alineado al framework.
// COMO FUNCIONA: `defineConfig` recibe arrays de reglas y `globalIgnores` añade exclusiones explícitas para artefactos generados.
// APRENDE MAS: https://eslint.org/docs/latest/use/configure/configuration-files
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // QUE HACE: Sobrescribe el set de ignorados por defecto del preset de Next.
  // POR QUE SE ELIGIO: Incluir exclusiones explícitas evita ruido de lint en build outputs y archivos generados por el framework.
  // COMO FUNCIONA: `globalIgnores` recibe patrones que ESLint omitirá durante el escaneo de archivos.
  // APRENDE MAS: https://eslint.org/docs/latest/use/configure/configuration-files
  globalIgnores([
    // QUE HACE: Enumera carpetas y archivos generados que no deben pasar por lint.
    // POR QUE SE ELIGIO: Analizar artefactos compilados añade coste sin aportar valor de calidad al código fuente.
    // COMO FUNCIONA: Los glob patterns filtran `.next`, `out`, `build` y `next-env.d.ts` desde el recorrido de ESLint.
    // APRENDE MAS: https://eslint.org/docs/latest/use/configure/configuration-files
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
