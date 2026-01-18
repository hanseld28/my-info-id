import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code')?.toUpperCase();

  if (!code || code.length !== 8) {
    return NextResponse.json(
      { error: 'Código inválido. Certifique-se de digitar os 8 caracteres.' },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();

  const { data: tag, error } = await supabase
    .from('tags')
    .select('id, status')
    .eq('security_code', code)
    .single();

  if (error || !tag) {
    return NextResponse.json(
      { error: 'Código de ativação não inválido.' },
      { status: 404 }
    );
  }

  if (tag.status !== 'pending') {
    return NextResponse.json(
      { error: 'Esta tag já foi ativada anteriormente.' },
      { status: 400 }
    );
  }

  return NextResponse.json({ 
    success: true, 
    message: 'Código válido.' 
  });
}