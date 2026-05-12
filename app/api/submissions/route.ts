import { getDB } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const sql = getDB();
    await sql`
      INSERT INTO submissions (
        exhibition, company, country, county, first_name, last_name,
        position, email, phone, contact_type, equipment_interest,
        current_equipment, additional_info, relevance
      ) VALUES (
        ${data.exhibition}, ${data.company}, ${data.country}, ${data.county},
        ${data.firstName}, ${data.lastName}, ${data.position},
        ${data.email}, ${data.phone}, ${data.type},
        ${data.equipmentInterest}, ${data.currentEquipment},
        ${data.additionalInfo}, ${data.relevance}
      )
    `;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sql = getDB();
    const rows = await sql`SELECT * FROM submissions ORDER BY created_at DESC`;
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updates } = data;
    const sql = getDB();
    await sql`
      UPDATE submissions SET
        exhibition = ${updates.exhibition},
        company = ${updates.company},
        country = ${updates.country},
        county = ${updates.county},
        first_name = ${updates.first_name},
        last_name = ${updates.last_name},
        position = ${updates.position},
        email = ${updates.email},
        phone = ${updates.phone},
        contact_type = ${updates.contact_type},
        equipment_interest = ${updates.equipment_interest},
        current_equipment = ${updates.current_equipment},
        additional_info = ${updates.additional_info},
        relevance = ${updates.relevance}
      WHERE id = ${id}
    `;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();
    const sql = getDB();
    await sql`DELETE FROM submissions WHERE id = ${data.id}`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
