import { NextResponse } from 'next/server';
import { getAgServices, createAgService } from '@/lib/advocateGrowthDb';

export async function GET() {
  try {
    const services = await getAgServices();
    return NextResponse.json(services);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    if (!data.title) return NextResponse.json({ error: 'title is required' }, { status: 400 });
    // Auto-generate slug if blank
    if (!data.slug) {
      data.slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    const service = await createAgService(data);
    return NextResponse.json(service, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
