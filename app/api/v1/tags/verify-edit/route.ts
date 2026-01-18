import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hash = searchParams.get('hash');
  const code = searchParams.get('code')?.toUpperCase();

  if (!hash || !code || code.length !== 8) {
    return NextResponse.json(
      { error: 'Dados insuficientes para verificação.' },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();

  const { data: tag, error } = await supabase
    .from('tags')
    .select('id, target_type, status')
    .eq('hash_url', hash)
    .eq('security_code', code)
    .single();

  if (error || !tag) {
    return NextResponse.json(
      { error: 'Código de segurança incorreto para esta tag.' },
      { status: 401 }
    );
  }

  if (tag.status !== 'active') {
    return NextResponse.json(
      { error: 'Esta tag ainda não foi ativada.' },
      { status: 403 }
    );
  }
 
  const { data: tagData, error: tagDataError } = await supabase
    .from('tag_data')
    .select()
    .eq('tag_id', tag.id)
    .single();

  if (tagDataError || !tagData) {
    return NextResponse.json(
      { error: 'Não foi possível encontrar os dados da tag.' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      ...tag,
      ...tagData
    }
  });
}