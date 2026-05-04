import { deletePost } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await deletePost(id);
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
