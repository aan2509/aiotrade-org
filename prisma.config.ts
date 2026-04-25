import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  datasource: {
    url: env("DIRECT_URL"),
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
  migrations: {
    path: "prisma/migrations",
  },
  schema: "prisma/schema.prisma",
});
