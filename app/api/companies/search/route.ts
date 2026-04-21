import { getDB } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || '';
  if (q.length < 2) return NextResponse.json([]);
  try {
    const sql = getDB();
    const results = await sql`
      SELECT name FROM companies
      WHERE name ILIKE ${q + '%'}
      ORDER BY name
      LIMIT 12
    `;
    return NextResponse.json(results.map((r: Record<string, unknown>) => r.name));
  } catch {
    return NextResponse.json([]);
  }
}
