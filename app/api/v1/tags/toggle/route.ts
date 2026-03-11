import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { logAuditAction } from '@/lib/utils/tag-audit';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { hashUrl, securityCode, currentStatus, reasonCode, justificationText } = body;

    const supabase = await createSupabaseServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Sessão inválida ou expirada.' }, { status: 401 });
    }

    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .select('id, status')
      .eq('hash_url', hashUrl)
      .eq('security_code', securityCode)
      .eq('owner_id', user.id)
      .maybeSingle();

    if (tagError || !tag) {
      return NextResponse.json({ error: 'Credenciais da tag inválidas ou tag não encontrada.' }, { status: 403 });
    }

    if (tag.status !== currentStatus) {
       return NextResponse.json({ error: 'O status da tag está desatualizado. Recarregue a página.' }, { status: 409 });
    }

    const isCurrentlyActive = currentStatus === 'active';
    const newStatus = isCurrentlyActive ? 'blocked' : 'active';
    const auditAction = isCurrentlyActive ? 'BLOCKED' : 'UNBLOCKED';

    const { error: updateError } = await supabase
      .from('tags')
      .update({ status: newStatus })
      .eq('id', tag.id);

    if (updateError) {
      throw updateError;
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'IP desconhecido';
    const userAgent = request.headers.get('user-agent') || 'Desconhecido';

    await logAuditAction({
      tagId: tag.id,
      performedBy: user.id,
      action: auditAction,
      oldStatus: currentStatus,
      newStatus: newStatus,
      metadata: {
        reasonCode,
        justificationText,
        clientIp: ip,
        userAgent: userAgent,
        authMethod: 'hash_and_security_code'
      }
    });

    return NextResponse.json({ success: true, newStatus });

  } catch (error) {
    console.error('[API EXCEPTION] Erro crítico no endpoint de toggle:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}