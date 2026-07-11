import { NextResponse } from 'next/server';
import { updateAgService, deleteAgService, getAgServicePage, upsertAgServicePage } from '@/lib/advocateGrowthDb';

export async function PUT(req, { params }) {
  try {
    const id = parseInt(params.id, 10);
    const data = await req.json();
    if (!data.title || !data.slug) return NextResponse.json({ error: 'title and slug are required' }, { status: 400 });
    const service = await updateAgService(id, data);
    return NextResponse.json(service);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = parseInt(params.id, 10);
    await deleteAgService(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// GET individual service page content for admin
export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id, 10);
    const page = await getAgServicePage(id);
    return NextResponse.json(page || {});
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
