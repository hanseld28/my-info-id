
export type ConsentTermType = 'lgpd_general' | 'lgpd_health_data' | 'terms_of_service' | 'privacy_policy';

export type ConsentActionType = 'accepted' | 'rejected';

export interface ConsentLog {
  tag_id: string;
  owner_id: string | null;
  action: ConsentActionType;
  term_type: ConsentTermType;
  version: string;
  ip_address: string;
  user_agent: string | null;
}