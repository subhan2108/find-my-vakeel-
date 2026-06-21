import { NextResponse } from 'next/server';
import { getLegalCategories } from '@/lib/db';

export async function GET() {
  try {
    const categories = await getLegalCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to fetch legal categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
