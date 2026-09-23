import { neon } from "@neondatabase/serverless";
import { APP_TIMEZONE, START_DATE, TARGET_DATE, dateKey } from "../lib/date";
import { MESSAGES } from "../lib/motivation";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing. Put your Neon connection string in .env.local, then run npm run db:setup.");
}

const sql = neon(databaseUrl);

async function setupDatabase() {
await sql`
  CREATE TABLE IF NOT EXISTS countdown_settings (
    id integer PRIMARY KEY,
    start_date date NOT NULL,
    target_date date NOT NULL,
    timezone text NOT NULL,
    recipient_email text,
    CONSTRAINT countdown_settings_single_row CHECK (id = 1)
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS motivation_messages (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    body text NOT NULL,
    sort_order integer NOT NULL UNIQUE
  )
`;

await sql`
  INSERT INTO countdown_settings (id, start_date, target_date, timezone, recipient_email)
  VALUES (1, ${dateKey(START_DATE)}::date, ${dateKey(TARGET_DATE)}::date, ${APP_TIMEZONE}, NULL)
  ON CONFLICT (id) DO NOTHING
`;

const existing = await sql`SELECT COUNT(*)::int AS count FROM motivation_messages`;
const count = Number(existing[0]?.count ?? 0);

if (count === 0) {
  for (const [index, body] of MESSAGES.entries()) {
    await sql`
      INSERT INTO motivation_messages (body, sort_order)
      VALUES (${body}, ${index})
    `;
  }
}

console.log(`Neon is ready. Settings: ${dateKey(START_DATE)} to ${dateKey(TARGET_DATE)}. Messages: ${count === 0 ? MESSAGES.length : count}.`);
}

setupDatabase().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
