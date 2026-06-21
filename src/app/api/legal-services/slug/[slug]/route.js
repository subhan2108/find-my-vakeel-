import { NextResponse } from 'next/server';
import { getLegalServiceBySlug } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const slug = params.slug;
    const service = await getLegalServiceBySlug(slug);
    if (!service) {
      return NextResponse.json({ error: 'Legal service not found' }, { status: 404 });
    }
    return NextResponse.json(service);
  } catch (error) {
    console.error('Failed to fetch legal service by slug:', error);
    return NextResponse.json({ error: 'Failed to fetch legal service' }, { status: 500 });
  }
}
