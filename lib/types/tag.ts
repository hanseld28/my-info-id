import { EmergencyContact } from './emergency-contact';
import { TagData } from './tag-data';

export type StatusType = 'pending' | 'active';

export type TargetType = 'pet' | 'child' | 'elderly' | 'pcd' | 'adult' | 'other';

export interface Tag {
  id: string;
  scan_token: string;
  hash_url: string;
  security_code: string;
  status: StatusType;
  target_type?: TargetType;
  created_at: string;
}

export interface TagViewData extends Pick<Tag,  'status' | 'target_type'>, TagData {
  emergency_contacts: EmergencyContact[];
  updated_at: string;
}

export interface TagBasicData extends Omit<Tag, 'created_at' | 'scan_token'> {
  tag_data: Pick<TagData, 'full_name'>;
}