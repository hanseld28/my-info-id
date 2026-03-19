import { ActivateTagParams } from '@/lib/services/tag.service';
import { ValidatorEngine } from './core/validator-engine';
import { RequiredFieldRule } from './rules/required-field.rule';
import { EmergencyContactsRule } from './rules/emergency-contacts.rule';

export const ActivateTagValidator = new ValidatorEngine<ActivateTagParams['data']>(
  [
    new RequiredFieldRule('code', 'O código de segurança é obrigatório.'),
    new RequiredFieldRule('target_type', 'O tipo de perfil é obrigatório.'),
    new RequiredFieldRule('full_name', 'O nome completo é obrigatório.'),
    new EmergencyContactsRule()
  ],
  'Os dados enviados são inválidos para ativação da tag.'
);