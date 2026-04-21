import { getDB } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sql = getDB();
    const rows = await sql`SELECT name FROM exhibitions WHERE active = true ORDER BY id`;
    return NextResponse.json(rows.map((r: Record<string, unknown>) => r.name));
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    const sql = getDB();
    await sql`INSERT INTO exhibitions (name) VALUES (${name}) ON CONFLICT (name) DO NOTHING`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { name } = await request.json();
    const sql = getDB();
    await sql`DELETE FROM exhibitions WHERE name = ${name}`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
