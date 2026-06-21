import { NextResponse } from 'next/server';
import { getLegalServices, createLegalService } from '@/lib/db';

export async function GET() {
  try {
    const services = await getLegalServices();
    return NextResponse.json(services);
  } catch (error) {
    console.error('Failed to fetch legal services:', error);
    return NextResponse.json({ error: 'Failed to fetch legal services' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.title || !data.category_id) {
      return NextResponse.json({ error: 'Title and category_id are required' }, { status: 400 });
    }
    const service = await createLegalService(data);
    return NextResponse.json(service[0]);
  } catch (error) {
    console.error('Failed to create legal service:', error);
    return NextResponse.json({ error: 'Failed to create legal service' }, { status: 500 });
  }
}
