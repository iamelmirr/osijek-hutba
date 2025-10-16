import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../src/lib/supabaseAdmin';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminPassword = req.headers.get('x-admin-password') || '';
  if (!process.env.ADMIN_PASSWORD) {
    return new NextResponse('ADMIN_PASSWORD not set', { status: 500 });
  }
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const { error } = await supabaseAdmin
      .from('hutbas')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('DB delete error', error);
      return new NextResponse('DB error', { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e: any) {
    console.error('Delete error', e);
    return new NextResponse(`Delete error: ${e.message || e}`, { status: 500 });
  }
}