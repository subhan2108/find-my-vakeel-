import { NextResponse } from 'next/server';
import { upsertAgServicePage } from '@/lib/advocateGrowthDb';

// POST /api/advocate-growth/services/[id]/page  -> save full page content
export async function POST(req, { params }) {
  try {
    const { id: rawId } = await params;
    const serviceId = parseInt(rawId, 10);
    const data = await req.json();
    const result = await upsertAgServicePage(serviceId, data);
    return NextResponse.json(result[0] || {});
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
