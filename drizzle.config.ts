import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// QUE HACE: Carga variables locales para que Drizzle Kit resuelva credenciales y rutas del esquema en entorno de desarrollo.
// POR QUE SE ELIGIO: Separar configuración de migraciones del runtime de la app evita acoplamiento y mantiene seguridad de secretos.
// COMO FUNCIONA: `dotenv.config` lee `.env.local` antes de exportar la configuración consumida por Drizzle Kit.
// APRENDE MAS: https://orm.drizzle.team/docs/drizzle-config-file
dotenv.config({ path: ".env.local" });

// QUE HACE: Declara la configuración declarativa de migraciones y generación de artefactos de Drizzle.
// POR QUE SE ELIGIO: Mantener el esquema y salida explícitos reduce errores de sincronización entre base de datos y código.
// COMO FUNCIONA: Drizzle Kit usa esta definición para leer schema.ts, emitir SQL/migraciones y conectar contra PostgreSQL.
// APRENDE MAS: https://orm.drizzle.team/docs/drizzle-config-file
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
