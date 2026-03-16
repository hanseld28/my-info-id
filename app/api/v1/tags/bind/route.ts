import { getLogger } from '@/lib/log/logger';
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const logger = getLogger(request);
  
  const { securityCode } = await request.json()

  logger.info({ securityCode }, 'Processing tag binding request');

  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    logger.warn('Unauthorized attempt to bind tag without valid session');
    return NextResponse.json({
      error: 'Acesso não autorizado'
    }, { status: 401 });
  }

  const { data: tag, error: findError } = await supabase
    .from('tags')
    .select('id, status, owner_id')
    .eq('security_code', securityCode.toUpperCase())
    .maybeSingle();

  if (findError || !tag) {
    logger.warn({ securityCode }, 'Tag not found for binding');
    return NextResponse.json({ error: 'Código inválido ou tag já vinculada.' }, { status: 404 })
  }

  if (tag.status === 'pending_activation') {
    logger.warn({ securityCode }, 'Attempt to bind pending activation tag');
    return NextResponse.json({ error: 'Esta tag ainda não foi ativada.' }, { status: 400 })
  }

  if (tag.owner_id !== null && tag.owner_id === user.id) {
    logger.warn({ securityCode }, 'Tag already bound to user');
    return NextResponse.json({ error: 'Esta tag já está vinculada ao seu usuário.' }, { status: 400 })
  }

  if (tag.owner_id !== null && tag.owner_id !== user.id) {
    logger.warn({ securityCode }, 'Attempt to bind tag owned by another user');
    return NextResponse.json({ error: 'Esta tag já pertence a outro usuário.' }, { status: 400 })
  }

  const { error: updateError } = await supabase
    .from('tags')
    .update({ 
        owner_id: user.id,
    })
    .eq('id', tag.id)

  if (updateError) {
    logger.error({ err: updateError, securityCode }, 'Error updating tag owner');
    return NextResponse.json({ error: 'Erro ao vincular tag ao usuário.' }, { status: 500 });
  }

  logger.info({ securityCode }, 'Tag bound successfully to user');
  return NextResponse.json({ success: true })
}