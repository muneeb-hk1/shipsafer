import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Client generation needs only the schema; database commands still require a URL.
    url: process.env.DATABASE_URL,
  },
});
