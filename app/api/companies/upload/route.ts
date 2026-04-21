import { getDB } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const text = await file.text();

    const lines = text.split('\n');
    const names: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      let name = '';
      if (line.startsWith('"')) {
        const endQuote = line.indexOf('"', 1);
        name = endQuote > 0 ? line.slice(1, endQuote) : line.slice(1);
      } else {
        name = line.split(',')[0];
      }
      name = name.trim().replace(/,+$/, '');
      if (name) names.push(name);
    }

    const sql = getDB();
    await sql`TRUNCATE companies RESTART IDENTITY`;
    for (const name of names) {
      await sql`INSERT INTO companies (name) VALUES (${name}) ON CONFLICT DO NOTHING`;
    }

    return NextResponse.json({ ok: true, count: names.length });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
