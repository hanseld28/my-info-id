import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { logAuditAction } from '@/lib/utils/tag-audit';
import { getLogger } from '@/lib/log/logger';
import { waitUntil } from '@vercel/functions';
import { AuditLogParams } from '@/lib/types/audit';

export async function POST(request: NextRequest) {
  const logger = getLogger(request);

  try {
    const body = await request.json();

    logger.debug({ payload: body }, 'Received payload from request');

    const { hashUrl, securityCode, currentStatus, reasonCode, justificationText } = body;

    const supabase = await createSupabaseServerClient();
    
    logger.info('Validating user authentication');

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      logger.error({ err: authError }, 'Session is invalid or expired');
      return NextResponse.json({ error: 'Sessão inválida ou expirada.' }, { status: 401 });
    }

    logger.debug({ user }, 'Authenticated user');

    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .select('id, status')
      .eq('hash_url', hashUrl)
      .eq('security_code', securityCode)
      .eq('owner_id', user.id)
      .maybeSingle();

    if (tagError || !tag) {
      logger.error({ err: tagError, tag }, 'Invalid or not found tag by provided credentials');
      return NextResponse.json({ error: 'Credenciais da tag inválidas ou tag não encontrada.' }, { status: 403 });
    }

    if (tag.status !== currentStatus) {
      logger.error({ savedStatus: tag.status, receivedStatus: currentStatus }, 'Invalid or not found tag by provided credentials');
      return NextResponse.json({ error: 'O status da tag está desatualizado. Recarregue a página.' }, { status: 409 });
    }

    const isCurrentlyActive = currentStatus === 'active';
    const newStatus = isCurrentlyActive ? 'blocked' : 'active';
    const auditAction = isCurrentlyActive ? 'BLOCKED' : 'UNBLOCKED';

    logger.debug({ current: currentStatus, new: newStatus, auditAction }, 'Review toggle tag status');

    const { error: updateError } = await supabase
      .from('tags')
      .update({ status: newStatus })
      .eq('id', tag.id);

    if (updateError) {
      logger.error({ err: updateError }, 'Failed to update tag status');
      throw updateError;
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'IP desconhecido';
    const userAgent = request.headers.get('user-agent') || 'Desconhecido';

    const auditData: AuditLogParams = {
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
    };

    waitUntil(
      logAuditAction(auditData, logger).catch((err) => {
        logger.error({ err }, 'Failed to log audit action');
      })
    );

    logger.info({ tagId: tag.id, newStatus }, 'Tag status updated successfully');

    return NextResponse.json({ success: true, newStatus });
    
  } catch (error) {
    logger.error({ err: error }, 'Critical error while toggling tag status');
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}