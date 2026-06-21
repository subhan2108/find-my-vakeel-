import { deletePost, updatePost, getPosts } from '@/lib/db';
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

    // Server-side validation
    if (!body.title || body.title.trim().length < 5) {
      return NextResponse.json({ error: 'Title must be at least 5 characters long' }, { status: 400 });
    }
    if (!body.content || body.content.trim().length < 20) {
      return NextResponse.json({ error: 'Content must be at least 20 characters long' }, { status: 400 });
    }
    if (body.slug) {
      const trimmedSlug = body.slug.trim().toLowerCase();
      if (!/^[a-z0-9\-]+$/.test(trimmedSlug)) {
        return NextResponse.json({ error: 'Slug must only contain lowercase letters, numbers, and hyphens' }, { status: 400 });
      }
      if (trimmedSlug.startsWith('-') || trimmedSlug.endsWith('-')) {
        return NextResponse.json({ error: 'Slug cannot start or end with a hyphen' }, { status: 400 });
      }
      const posts = await getPosts();
      const duplicate = posts.find(p => p.slug === trimmedSlug && String(p.id) !== String(id));
      if (duplicate) {
        return NextResponse.json({ error: 'This slug is already in use by another post' }, { status: 400 });
      }
    }

    const updatedPost = await updatePost(id, body);
    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
