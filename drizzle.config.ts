import * as dotenv from "dotenv";
dotenv.config();
 
export default {
  schema: "./src/db/schema.ts",
  dialect: 'postgresql',
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DRIZZLE_DATABASE_URL,
  },
  migration: {
    table: "migrations",
    schema: "public"
}
} ;