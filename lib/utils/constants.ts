import { 
  Baby, 
  User, 
  Dog, 
  Accessibility, 
  PersonStanding, 
  Users, 
  LucideProps
} from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export const TARGET_TYPE_LABELS: Record<string, string> = {
  child: 'Criança',
  teen: 'Adolescente',
  adult: 'Adulto',
  elderly: 'Idoso',
  pcd: 'PCD (Pessoa com Deficiência)',
  pet: 'Pet',
  other: 'Outro'
};

export const TARGET_TYPE_HUMAN_LIST = ['child', 'teen', 'adult', 'elderly', 'pcd']

export const BLOOD_TYPE_HUMAN_LIST: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const TARGET_CONFIG: Record<string, { label: string, icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>, color: string }> = {
  child: { label: 'Criança', icon: Baby, color: 'bg-pink-100 text-pink-600' },
  teen: { label: 'Adolescente', icon: Users, color: 'bg-purple-100 text-purple-600' },
  adult: { label: 'Adulto', icon: User, color: 'bg-blue-100 text-blue-600' },
  elderly: { label: 'Idoso', icon: PersonStanding, color: 'bg-emerald-100 text-emerald-600' },
  pcd: { label: 'PCD', icon: Accessibility, color: 'bg-indigo-100 text-indigo-600' },
  pet: { label: 'Pet', icon: Dog, color: 'bg-orange-100 text-orange-600' },
  other: { label: 'Outro', icon: User, color: 'bg-slate-100 text-slate-600' },
};