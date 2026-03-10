import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { securityCode } = await request.json()

  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
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
    return NextResponse.json({ error: 'Código inválido ou tag já vinculada.' }, { status: 404 })
  }

  if (tag.status === 'pending_activation') {
    return NextResponse.json({ error: 'Esta tag ainda não foi ativada.' }, { status: 400 })
  }

  if (tag.owner_id !== null && tag.owner_id === user.id) {
    return NextResponse.json({ error: 'Esta tag já está vinculada ao seu usuário.' }, { status: 400 })
  }

  if (tag.owner_id !== null && tag.owner_id !== user.id) {
    return NextResponse.json({ error: 'Esta tag já pertence a outro usuário.' }, { status: 400 })
  }

  const { error: updateError } = await supabase
    .from('tags')
    .update({ 
        owner_id: user.id,
    })
    .eq('id', tag.id)

  if (updateError) {
    return NextResponse.json({ error: 'Erro ao vincular tag ao usuário.' }, { status: 500 });
  }

  return NextResponse.json({ success: true })
}