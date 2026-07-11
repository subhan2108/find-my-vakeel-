import { NextResponse } from 'next/server';
import { getAgCategories, upsertAgCategory, deleteAgCategory } from '@/lib/advocateGrowthDb';

export async function GET() {
  try {
    const cats = await getAgCategories();
    return NextResponse.json(cats);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    if (!data.id || !data.label) return NextResponse.json({ error: 'id and label are required' }, { status: 400 });
    // Sanitise id to slug format
    data.id = data.id.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const [cat] = await upsertAgCategory(data);
    return NextResponse.json(cat, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    await deleteAgCategory(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
