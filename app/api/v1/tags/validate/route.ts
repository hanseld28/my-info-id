import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code')?.toUpperCase();

  if (!code || code.length !== 6) {
    return NextResponse.json(
      { error: 'Código inválido. Certifique-se de digitar os 6 caracteres.' },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();

  const { data: tag, error } = await supabase
    .from('tags')
    .select('id, status, security_code')
    .eq('security_code', code)
    .maybeSingle();

  if (error || !tag) {
    return NextResponse.json(
      { error: 'Código de segurança inválido.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ 
    success: true,
    data: {
      code: tag.security_code,
      status: tag.status,
    },
    message: 'Código válido.'
  });
}