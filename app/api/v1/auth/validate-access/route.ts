import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email } = await req.json();

  const supabase = await createSupabaseServerClient();

  const { data: authUsers, error: authError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .limit(1)
    .maybeSingle();

  if (authError) {
    console.error('Error fetching user profile:', authError);
    return NextResponse.json({ error: 'Erro ao verificar o usuário' }, { status: 500 });
  }

  if (authUsers) {
    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .select('id')
      .eq('owner_id', authUsers.id)
      .limit(1)
      .maybeSingle();

    if (tagError) {
      console.error('Error fetching user tag:', tagError);
      return NextResponse.json({ error: 'Erro ao verificar produtos do usuário' }, { status: 500 });
    }

    if (tag) {
      return NextResponse.json({ action: 'SEND_MAGIC_LINK' });
    }
  }

  return NextResponse.json({ 
    action: 'REQUIRE_SECURITY_CODE',
    error: 'Nenhum produto ativo encontrado para este e-mail.',
    message: 'Para criar sua conta, informe o código de segurança da sua tag Meu Info ID.'
  }, { status: 403 });
}