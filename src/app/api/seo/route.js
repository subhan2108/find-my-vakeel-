import { getStaticSeo, updateStaticSeo } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const route = searchParams.get('route');

  if (!route) {
    return NextResponse.json({ error: 'Route parameter is required' }, { status: 400 });
  }

  try {
    const seo = await getStaticSeo(route);
    return NextResponse.json(seo || {});
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { route, ...seoData } = body;

    if (!route) {
      return NextResponse.json({ error: 'Route is required' }, { status: 400 });
    }

    const updated = await updateStaticSeo(route, seoData);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
