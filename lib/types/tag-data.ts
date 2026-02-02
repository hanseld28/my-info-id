export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface TagData {
  full_name: string;
  birth_date?: string;
  weight_kg?: number;
  height_cm?: number;
  blood_type?: BloodType;
  medications?: string;
  allergies?: string;
  health_conditions?: string;
  quick_instructions?: string;
  observations?: string;
}