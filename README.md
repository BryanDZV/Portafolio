# Portafolio

Aplicación web interactiva que centraliza y expone proyectos de ingeniería de software mediante un sitio público internacionalizado y un panel de administración seguro.
Resuelve la necesidad de gestionar un perfil profesional dinámico, separando la capa de presentación de la administración y persistencia de datos.

## Arquitectura y Buenas Prácticas

*   **Adaptabilidad al Stack:** Arquitectura mantenible y escalable que se ciñe a las convenciones nativas de Next.js.
*   **Gestión de Tipos (TypeScript):** Interfaces y definiciones estáticas aisladas en archivos dedicados, permitiendo un tipado estricto transversal sin acoplarse a la implementación.
*   **Separación de Responsabilidades (SoC):** La interfaz tiene como único objetivo la presentación visual. La lógica de negocio y manipulación de datos residen exclusivamente en hooks personalizados y controladores.
*   **Alta Reutilización (DRY):** Lógica y componentes extraídos de forma modular para evitar la duplicidad de código.
*   **Arquitectura UI (Atomic Design & SRP):** Componentes construidos bajo el Principio de Responsabilidad Única, logrando un ecosistema independiente, predecible y testeable.
*   **Manejo de Errores Granular:** Control de excepciones aislado por módulo para evitar comprometer la estabilidad global de la aplicación.

## Stack Tecnológico

*   **Core:** Next.js 16.2.3, React 19.2.4, TypeScript 5
*   **Interfaz de Usuario (UI):** Tailwind CSS 4, Framer Motion, Shadcn UI, Radix UI
*   **Gestión de Estado:** Zustand
*   **Base de Datos y Autenticación:** Postgres, Drizzle ORM, Supabase (JS y SSR)
*   **Internacionalización:** FormatJS Intl Localematcher, Negotiator
*   **Testing y Calidad:** Jest, Playwright, React Testing Library, ESLint, Lighthouse CI

## Requisitos previos e Instalación local

Para ejecutar este proyecto en un entorno local, es necesario contar con Node.js (versión 20 o superior) y disponer de un entorno de base de datos Postgres / Supabase configurado.

Debe crearse un archivo `.env` en la raíz del proyecto referenciando las siguientes variables (obtenidas desde los secretos o el panel de configuración):
*   `DATABASE_URL`
*   `NEXT_PUBLIC_SUPABASE_URL`
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Ejecutar los siguientes comandos en la terminal para iniciar el entorno de desarrollo:

```bash
npm install
npm run dev
```

Abre la aplicación en:

```bash
http://localhost:3000
```

## Scripts disponibles

- `npm run dev` para desarrollo
- `npm run build` para generar la build
- `npm run start` para ejecutar la versión compilada
- `npm run lint` para revisar el código

## Lo que quiero mejorar más adelante

- terminar la edición de proyectos
- mejorar validaciones y mensajes de error
- seguir afinando diseño y experiencia de usuario
- reforzar organización interna del código
- añadir más contenido real al portfolio

## Nota final

Este portfolio no está presentado como un trabajo terminado. Es una base real de aprendizaje, hecha con ganas de seguir mejorándola y con margen claro de evolución.
