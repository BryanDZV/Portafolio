# Mi Portafolio Personal

Este es el repositorio de mi portafolio web. Lo creé con un doble propósito: tener un lugar bonito donde mostrar los proyectos que voy haciendo y, sobre todo, usarlo como excusa para aprender a fondo tecnologías modernas como **Next.js, TypeScript y bases de datos con Supabase**.

## ¿De qué trata el proyecto?

Básicamente es una web dividida en dos partes:

1. **La web pública:** Donde los reclutadores y visitantes pueden ver mis proyectos, tecnologías que manejo y contactarme.En proceso para varios idiomas.
2. **Un panel de administración privado:** Una zona oculta con login donde puedo gestionar (crear, editar, borrar) mis proyectos directamente conectados a una base de datos, sin tener que tocar el código fuente cada vez que quiero subir algo nuevo.

## Tecnologías que utilicé

Elegí este stack porque son las herramientas que más se usan hoy en día y quería retarme a entender cómo funcionan juntas en un entorno más cercano a lo real:

- **Frontend:** Next.js (con App Router), React, Tailwind CSS y Framer Motion (para darle un toque de animaciones fluidas).
- **Lenguaje:** TypeScript .
- **Backend y Base de Datos:** Supabase (para la autenticación y guardar datos en Postgres) + Drizzle ORM (para interactuar con la base de datos de forma fácil y tipada).
- **Estado global:** Zustand (súper ligero y mucho más fácil de entender que Redux).
- **Testing & Calidad:** Estoy empezando a configurar pruebas con Jest y Playwright, además de usar ESLint para mantener el código limpio.

## Cómo ejecutarlo en tu PC

Si quieres clonar el repo y trastear con el código (o si eres reclutador y quieres ver cómo lo he montado), aquí tienes los pasos:

1. Necesitas Node.js instalado (versión 20 o superior).
2. Clona este repositorio y abre la carpeta en tu terminal.
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Configura las variables de entorno. Crea un archivo `.env.local` en la raíz del proyecto y añade tus credenciales (necesitarás un proyecto gratuito en Supabase):
   ```env
   DATABASE_URL="tu_url_de_postgres"
   NEXT_PUBLIC_SUPABASE_URL="tu_url_de_supabase"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="tu_anon_key"
   ```
5. Arranca el servidor de desarrollo:
   ```bash
   npm run dev
   ```
6. Abre `http://localhost:3000` en tu navegador y listo.

## Próximos pasos (Lo que quiero mejorar)

Como perfil Junior, Este proyecto es mi "patio de juegos" y poco a poco lo voy puliendo. Mi lista de tareas incluye:

- [ ] Terminar algunas validaciones visuales en el formulario de edición de proyectos.
- [ ] Aumentar poco a poco la cobertura de testing (unitario y E2E).
- [ ] Refactorizar algunos componentes para que el código quede aún más limpio.
- [ ] Seguir mejorando el rendimiento basándome en lo que me dice Lighthouse.

---

¡Gracias por pasarte a mirar mi código! Cualquier feedback o sugerencia de mejora es súper bien recibida.
