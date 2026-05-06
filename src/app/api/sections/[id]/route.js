import { updateSection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const updatedSection = await updateSection(id, body);
    return NextResponse.json(updatedSection);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
