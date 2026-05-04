import { getPosts, createPost } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const posts = await getPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newPost = await createPost(body);
    return NextResponse.json(newPost);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
