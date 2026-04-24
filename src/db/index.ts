import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";
import * as schema from "./schema";

// QUE HACE: Obtiene la cadena de conexión para inicializar el cliente PostgreSQL usado por Drizzle.
// POR QUE SE ELIGIO: Externalizar credenciales en variables de entorno evita hardcodeo y facilita despliegue multi-entorno.
// COMO FUNCIONA: Lee `DATABASE_URL` del runtime y la utiliza como fuente única para creación del cliente.
// APRENDE MAS: https://orm.drizzle.team/docs/connect-overview
const connectionString = process.env.DATABASE_URL!;

// QUE HACE: Define un contenedor tipado en `globalThis` para reutilizar la conexión durante hot reload en desarrollo.
// POR QUE SE ELIGIO: Evita apertura de conexiones duplicadas por recargas del servidor y previene agotamiento del pool local.
// COMO FUNCIONA: Declara una propiedad opcional `postgresClient` que persiste entre evaluaciones de módulo en dev.
// APRENDE MAS: https://orm.drizzle.team/docs/connect-overview
const globalForDb = globalThis as unknown as {
  postgresClient?: Sql;
};

// QUE HACE: Determina tamaño máximo del pool de conexiones con fallback por entorno.
// POR QUE SE ELIGIO: Permite escalar concurrencia en producción sin sacrificar estabilidad local en desarrollo.
// COMO FUNCIONA: Lee `DB_POOL_MAX`, valida rango positivo y aplica fallback (`1` dev, `5` production) si el valor es inválido.
// APRENDE MAS: https://orm.drizzle.team/docs/connect-overview y https://www.postgresql.org/docs/current/runtime-config-connection.html
const DEFAULT_POOL_MAX = process.env.NODE_ENV === "production" ? 5 : 1;
const configuredPoolMax = Number.parseInt(process.env.DB_POOL_MAX ?? "", 10);
const poolMax =
  Number.isFinite(configuredPoolMax) && configuredPoolMax > 0
    ? configuredPoolMax
    : DEFAULT_POOL_MAX;

// QUE HACE: Inicializa cliente PostgreSQL con estrategia singleton y parámetros conservadores de conexión.
// POR QUE SE ELIGIO: `max: 1` reduce presión de conexiones en entornos serverless/desarrollo y `prepare: false` evita incompatibilidades.
// COMO FUNCIONA: Si existe cliente en `globalForDb` lo reutiliza; si no, crea uno nuevo con timeouts explícitos.
// APRENDE MAS: https://orm.drizzle.team/docs/connect-overview
const client =
  globalForDb.postgresClient ??
  postgres(connectionString, {
    max: poolMax,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });

// QUE HACE: Persiste el cliente en memoria global solo durante desarrollo.
// POR QUE SE ELIGIO: En producción cada proceso debe controlar su propio ciclo de vida sin depender de mutaciones globales.
// COMO FUNCIONA: Condiciona asignación por `NODE_ENV` y guarda la referencia para reuso en siguientes importaciones.
// APRENDE MAS: https://orm.drizzle.team/docs/connect-overview
if (process.env.NODE_ENV !== "production") {
  globalForDb.postgresClient = client;
}

// QUE HACE: Expone instancia `db` tipada para ejecutar queries con el esquema de dominio registrado.
// POR QUE SE ELIGIO: Centralizar construcción del ORM garantiza configuración uniforme y simplifica mantenimiento.
// COMO FUNCIONA: `drizzle` envuelve el cliente postgres e inyecta `schema` para autocompletado y seguridad de tipos.
// APRENDE MAS: https://orm.drizzle.team/docs/connect-overview
export const db = drizzle(client, { schema });
