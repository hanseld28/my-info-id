import { getLogger } from '@/lib/log/logger';
import { createSupabaseServerClient } from '@/lib/database/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const logger = getLogger(req);

  const { email } = await req.json();

  logger.info({ action: 'validate_access_attempt' }, 'Initializing request');

  const supabase = await createSupabaseServerClient();

  logger.debug({ email }, 'Validating profile by e-mail');

  const { data: authUser, error: authError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .limit(1)
    .maybeSingle();

  if (authError) {
    logger.error({ err: authError }, 'Error fetching user profile');
    return NextResponse.json({ error: 'Erro ao verificar o usuário' }, { status: 500 });
  }

  if (authUser) {
    logger.debug({ authUser }, 'Found user profile');

    logger.info('Verifying linked tags on user');

    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .select('id')
      .eq('owner_id', authUser.id)
      .limit(1)
      .maybeSingle();

    if (tagError) {
      logger.error({ err: tagError }, 'Error fetching associated user tag');
      return NextResponse.json({ error: 'Erro ao verificar produtos do usuário' }, { status: 500 });
    }

    if (tag) {
      const action = 'SEND_MAGIC_LINK';
      logger.info({ action, email }, 'Authorized to send magic link by e-mail');
      return NextResponse.json({ action });
    }
  }

  logger.info({ email }, 'No active products were found for provided email address.');

  return NextResponse.json({ 
    action: 'REQUIRE_SECURITY_CODE',
    error: 'Nenhum produto ativo encontrado para este e-mail.',
    message: 'Para criar sua conta, informe o código de segurança da sua tag Meu Info ID.'
  }, { status: 403 });
}