export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface TagData {
  full_name: string;
  phone: string;
  phone_secondary?: string;
  photo_url?: string;
  blood_type?: BloodType;
  quick_instructions?: string;
  observations?: string;
}