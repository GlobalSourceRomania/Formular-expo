import { getDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sql = getDB();
    const rows = await sql`SELECT * FROM submissions ORDER BY created_at DESC`;

    const escape = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;

    const headers = [
      'ID', 'Data', 'Expozitie', 'Companie', 'Tara', 'Judet', 'Prenume', 'Nume',
      'Functie', 'Email', 'Telefon', 'Tip', 'Echipament Interes',
      'Echipament Prezent', 'Info Aditionala', 'Relevanta',
    ];

    const csvRows = [
      headers.map(escape).join(','),
      ...rows.map((r: Record<string, unknown>) =>
        [
          r.id, r.created_at, r.exhibition, r.company, r.country, r.county,
          r.first_name, r.last_name, r.position, r.email, r.phone,
          r.contact_type, r.equipment_interest, r.current_equipment,
          r.additional_info, r.relevance,
        ].map(escape).join(',')
      ),
    ];

    const date = new Date().toISOString().split('T')[0];
    return new NextResponse('\uFEFF' + csvRows.join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="expo-contacts-${date}.csv"`,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
