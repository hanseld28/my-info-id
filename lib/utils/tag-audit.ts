import { createSupabaseServerClient } from '@/lib/supabase/server';
import { AuditLogParams } from '../types/audit';

export async function logAuditAction({
  tagId,
  performedBy,
  action,
  oldStatus = null,
  newStatus,
  metadata = {}
}: AuditLogParams) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from('tag_audit_logs').insert({
    tag_id: tagId,
    performed_by: performedBy,
    action: action,
    old_status: oldStatus,
    new_status: newStatus,
    metadata: metadata
  });

  if (error) {
    console.error(`[AUDIT ERROR] Falha ao registrar log para tag ${tagId}:`, error.message);
  }
}