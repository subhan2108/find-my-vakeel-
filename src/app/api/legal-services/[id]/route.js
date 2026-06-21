import { NextResponse } from 'next/server';
import { updateLegalService, deleteLegalService } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();
    if (!data.title || !data.category_id) {
      return NextResponse.json({ error: 'Title and category_id are required' }, { status: 400 });
    }
    const service = await updateLegalService(id, data);
    if (!service || service.length === 0) {
      return NextResponse.json({ error: 'Legal service not found' }, { status: 404 });
    }
    return NextResponse.json(service[0]);
  } catch (error) {
    console.error('Failed to update legal service:', error);
    return NextResponse.json({ error: 'Failed to update legal service' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await deleteLegalService(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete legal service:', error);
    return NextResponse.json({ error: 'Failed to delete legal service' }, { status: 500 });
  }
}
