import { deletePost, updatePost } from '@/lib/db';
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

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedPost = await updatePost(id, body);
    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
