export type StatusType = 'pending' | 'active';

export type TargetType = 'pet' | 'child' | 'elderly' | 'pcd' | 'adult' | 'other';

export interface Tag {
  id: string;
  hash_url: string;
  security_code: string;
  status: StatusType;
  target_type?: TargetType;
  created_at: string;
}