import { ValidationRule } from '../core/validation-rule.interface';
import { ActivateTagParams } from '@/lib/services/tag.service';

export class EmergencyContactsRule implements ValidationRule<ActivateTagParams['data']> {
  validate(data: ActivateTagParams['data']): string[] | null {
    const errors: string[] = [];

    if (!data.emergency_contacts || data.emergency_contacts.length === 0) {
      return ["É obrigatório cadastrar pelo menos um contato de emergência."];
    }

    data.emergency_contacts.forEach((contact, index) => {
      if (!contact.name?.trim()) {
        errors.push(`O nome do ${index + 1}º contato de emergência é obrigatório.`);
      }
      if (!contact.phone?.trim()) {
        errors.push(`O telefone do ${index + 1}º contato de emergência é obrigatório.`);
      }
    });

    return errors.length > 0 ? errors : null;
  }
}