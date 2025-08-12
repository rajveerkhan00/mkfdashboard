import { NextResponse } from 'next/server';
import { createSuperAdmin } from '@/server/createSuperAdmin'; 

export async function GET() {
  try {
    await createSuperAdmin();
    return NextResponse.json({ success: true, message: 'Super admin created' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
