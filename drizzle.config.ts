import * as dotenv from "dotenv";
dotenv.config();
 
export default {
  schema: "./src/db/schema.ts",
  dialect: 'postgresql',
  out: "./drizzle",
  dbCredentials: {
    url: "postgresql://neondb_owner:21FeuqHLMDzE@ep-small-band-a2ttzgl5.eu-central-1.aws.neon.tech/neondb?sslmode=require",
  },
  migration: {
    table: "migrations",
    schema: "public"
}
} ;