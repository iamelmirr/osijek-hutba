import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '../../../src/lib/supabaseAdmin';
import { translateAllSequential } from '../../../src/lib/openai';

const BodySchema = z.object({
  title_hr: z.string().min(1),
  content_hr: z.string().min(1)
});

export async function POST(req: NextRequest) {
  const adminPassword = req.headers.get('x-admin-password') || '';
  if (!process.env.ADMIN_PASSWORD) {
    return new NextResponse('ADMIN_PASSWORD not set', { status: 500 });
  }
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return new NextResponse('Invalid body', { status: 400 });
  }

  const { title_hr, content_hr } = body;

  try {
    const translations = await translateAllSequential(title_hr, content_hr);

    const title = {
      hr: title_hr,
      en: translations.en.title,
      ar: translations.ar.title,
      sq: translations.sq.title,
      bn: translations.bn.title,
      ur: translations.ur.title
    };
    const content = {
      hr: content_hr,
      en: translations.en.content,
      ar: translations.ar.content,
      sq: translations.sq.content,
      bn: translations.bn.content,
      ur: translations.ur.content
    };

    const { data, error } = await supabaseAdmin
      .from('hutbas')
      .insert([{ title, content, created_by: 'admin' }])
      .select('id')
      .single();

    if (error) {
      console.error('DB insert error', error);
      return new NextResponse('DB error', { status: 500 });
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (e: any) {
    console.error('Translation error', e);
    return new NextResponse(`Translation error: ${e.message || e}`, { status: 500 });
  }
}