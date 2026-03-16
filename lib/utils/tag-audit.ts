import { createSupabaseServerClient } from '@/lib/supabase/server';
import { AuditLogParams } from '../types/audit';
import pino from 'pino';

export async function logAuditAction(
  {
    tagId,
    performedBy,
    action,
    oldStatus = null,
    newStatus,
    metadata = {}
  }: AuditLogParams,
  logger?: pino.Logger<never, boolean>
) {
  const supabase = await createSupabaseServerClient();

  logger?.info({ tagId, performedBy, action, oldStatus, newStatus, metadata }, 'Logging audit action for tag');

  const { error } = await supabase.from('tag_audit_logs')
    .insert({
      tag_id: tagId,
      performed_by: performedBy,
      action: action,
      old_status: oldStatus,
      new_status: newStatus,
      metadata: metadata
    });

  if (error) {
    logger?.error({ err: error }, `Error on tag audit log for tag ${tagId}:`);
  } else {
    logger?.info({ tagId }, 'Tag audit log saved successfully');
  }
}