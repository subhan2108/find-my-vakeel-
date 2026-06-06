import { getCustomPages, updateCustomPage, getCustomPagesByTag, deleteCustomPage } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    
    const pages = tag ? await getCustomPagesByTag(tag) : await getCustomPages();
    return NextResponse.json(pages);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { slug, ...data } = body;
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const updated = await updateCustomPage(slug, data);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { slug } = body;

    if (typeof slug !== 'string') {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const deleted = await deleteCustomPage(slug);
    if (!deleted.length) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted: deleted[0] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
