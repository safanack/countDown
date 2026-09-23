import { neon } from "@neondatabase/serverless";

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getSql() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set. Add your Neon connection string to .env.local.");
  }

  return neon(databaseUrl);
}
