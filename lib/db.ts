import { neon } from '@neondatabase/serverless';

export function getDB() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set');
  return neon(process.env.DATABASE_URL);
}

export async function initDB() {
  const sql = getDB();

  await sql`
    CREATE TABLE IF NOT EXISTS exhibitions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      CONSTRAINT exhibitions_name_unique UNIQUE (name),
      active BOOLEAN DEFAULT true
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS companies (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      CONSTRAINT companies_name_unique UNIQUE (name)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS submissions (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      exhibition TEXT,
      company TEXT,
      country TEXT DEFAULT 'România',
      county TEXT,
      first_name TEXT,
      last_name TEXT,
      position TEXT,
      email TEXT,
      phone TEXT,
      contact_type TEXT,
      equipment_interest TEXT,
      current_equipment TEXT,
      additional_info TEXT,
      relevance INTEGER
    )
  `;

  // Adauga coloana country daca nu exista (pentru baze de date existente)
  await sql`
    ALTER TABLE submissions ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'România'
  `;

  await sql`
    INSERT INTO exhibitions (name) VALUES
      ('BSDA - Bucuresti 2026'),
      ('Robotics Expo - Brasov 2026'),
      ('Automotiv Expo Sibiu 2026')
    ON CONFLICT (name) DO NOTHING
  `;
}
