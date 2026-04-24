# Aprendiendo

Este proyecto es mi portfolio personal en su versión 1. Está hecho como parte de mi aprendizaje en DAW y todavía está en proceso de mejora. La idea es ir puliéndolo poco a poco, tanto en diseño como en funcionalidad, mientras sigo practicando con herramientas y buenas bases de desarrollo.

## Qué es este proyecto

Es una web de portfolio con enfoque visual e interactivo, pensada para mostrar mis proyectos y dar una imagen más completa de lo que voy aprendiendo como desarrollador.

Ahora mismo incluye:

- portada principal con contenido en español e inglés
- secciones de presentación, proyectos y sobre mí
- diseño responsive
- animaciones y transiciones suaves
- tema claro y oscuro
- panel de administración con login
- gestión de proyectos desde el panel
- endpoint API para consultar proyectos

## Tecnologías que estoy usando

- Next.js 16 con App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Supabase para autenticación y datos
- Drizzle ORM para la base de datos
- Zustand para estado global
- Shadcn UI y Radix UI para algunos componentes

## Estructura general

- `src/app/[lang]/(public)` para la parte pública de la web
- `src/app/[lang]/(admin)` para el panel de administración
- `src/app/api/projects` para exponer proyectos por API
- `src/components` para componentes reutilizables
- `src/db` y `src/lib` para acceso a datos y lógica del servidor

## Funcionalidades actuales

### Parte pública

- página principal con contenido dinámico por idioma
- secciones de hero, proyectos y presentación
- enlace a la página de contacto
- experiencia visual con animaciones y efectos suaves

### Parte de administración

- login para acceder al panel
- listado de proyectos guardados en la base de datos
- creación de nuevos proyectos
- borrado de proyectos
- opción de edición preparada, aunque todavía no está terminada

### Datos y API

- lectura de proyectos desde la base de datos
- caché en servidor para mejorar rendimiento
- contrato JSON para consumir proyectos desde la API

## Estado del proyecto

Esto sigue siendo una primera versión. Hay cosas que ya funcionan bien, pero todavía faltan mejoras de estructura, validación, edición completa del CRUD y más pulido general.

No lo dejo como algo cerrado porque la intención es seguir trabajando encima de esta base.

## Cómo arrancarlo en local

Primero instala dependencias:

```bash
npm install
```

Después levanta el servidor de desarrollo:

```bash
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
