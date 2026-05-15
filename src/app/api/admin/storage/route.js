import { getDatabaseSize } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sizeBytes = await getDatabaseSize();
    // Neon Free Tier is 512 MB
    const limitBytes = 512 * 1024 * 1024; 
    
    return NextResponse.json({
      used_bytes: parseInt(sizeBytes),
      limit_bytes: limitBytes,
      used_formatted: formatBytes(sizeBytes),
      limit_formatted: formatBytes(limitBytes),
      percent_used: Math.min(100, (sizeBytes / limitBytes) * 100).toFixed(2)
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
