export type AuditAction = 'CREATED' | 'ACTIVATED' | 'LINKED' | 'BLOCKED' | 'UNBLOCKED' | 'REASSIGNED';

export interface AuditLogParams {
  tagId: string;
  performedBy: string;
  action: AuditAction;
  oldStatus?: string | null;
  newStatus: string;
  metadata?: Record<string, unknown>;
}