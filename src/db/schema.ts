import { pgTable, uuid, text, timestamp, varchar } from "drizzle-orm/pg-core";

// QUE HACE: Modela la entidad `projects` con constraints de integridad para almacenamiento en PostgreSQL.
// POR QUE SE ELIGIO: Centralizar esquema en Drizzle crea una fuente de verdad tipada que reduce drift entre código y base de datos.
// COMO FUNCIONA: Define columnas, nulabilidad y defaults; Drizzle usa esta metadata para queries seguras y generación de migraciones.
// APRENDE MAS: https://orm.drizzle.team/docs/sql-schema-declaration
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  techStack: text("tech_stack").array().notNull(),
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
