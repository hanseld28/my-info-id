export type ContactRelationship = 
  | 'mother' | 'father' | 'guardian' | 'brother' | 'sister' 
  | 'son' | 'daughter' | 'friend' | 'spouse' | 'partner' 
  | 'assistant' | 'manager' | 'other' | 'roommate' | 'doctor' 
  | 'emergency' | 'family_member' | 'teacher' | 'caregiver' 
  | 'social_worker' | 'school' | 'daycare';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: ContactRelationship;
  is_primary: boolean;
}

export interface Contact {
  name: string;
  phone: string;
  relationship?: ContactRelationship;
  is_primary: boolean;
}