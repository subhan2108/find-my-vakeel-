import { NextResponse } from 'next/server';
import { getAgLanding, saveAgLandingKey } from '@/lib/advocateGrowthDb';

export async function GET() {
  try {
    const settings = await getAgLanding();
    return NextResponse.json(settings);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    // body can be { key, value } for a single key, or { sections: { key: value, ... } } for bulk
    if (body.key !== undefined) {
      await saveAgLandingKey(body.key, body.value);
      return NextResponse.json({ success: true });
    }
    if (body.sections && typeof body.sections === 'object') {
      for (const [key, value] of Object.entries(body.sections)) {
        await saveAgLandingKey(key, value);
      }
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
