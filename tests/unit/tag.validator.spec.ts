import { describe, it, expect } from 'vitest';
import { TagValidator } from '@/lib/validators/tag.validator';
import { ValidationError } from '@/lib/errors/custom-errors';
import { ActivateTagParams } from '@/lib/services/tag.service';

describe('TagValidator - validateActivationData', () => {
  const validData: ActivateTagParams['data'] = {
    code: '123456',
    target_type: 'person',
    full_name: 'Cliente Teste',
    emergency_contacts: [
      { name: 'Mãe', phone: '11999999999', is_primary: true }
    ] as ActivateTagParams['data']['emergency_contacts']
  };

  it('Should not throw errors when the data is perfectly valid', () => {
    expect(() => TagValidator.validateAll(validData)).not.toThrow();
  });

  it('Should accumulate errors from all missing basic fields', () => {
    const invalidData: ActivateTagParams['data'] = {} as ActivateTagParams['data'];

    expect(() => TagValidator.validateAll(invalidData)).toThrow(
      expect.objectContaining({
        code: 'VALIDATION_ERROR',
        details: expect.arrayContaining([
          "O código de segurança é obrigatório.",
          "O tipo de perfil é obrigatório.",
          "O nome completo é obrigatório.",
          "É obrigatório cadastrar pelo menos um contato de emergência."
        ])
      })
    );
  });

  it('Should fail if the basic fields are filled only with whitespace', () => {
    const dataComEspacos = {
      ...validData,
      code: '   ',
      target_type: '   ',
      full_name: '   ',
    };

    expect(() => TagValidator.validateAll(dataComEspacos)).toThrowError(ValidationError);
  });

  it('Should fail if the emergency contacts list is empty', () => {
    const dataSemContatos = { ...validData, emergency_contacts: [] };

    expect(() => TagValidator.validateAll(dataSemContatos)).toThrow(
      expect.objectContaining({
        details: expect.arrayContaining(["É obrigatório cadastrar pelo menos um contato de emergência."])
      })
    );
  });

  it('Should fail if any emergency contact is missing name or phone', () => {
    const dataContatosInvalidos: ActivateTagParams['data'] = {
      ...validData,
      emergency_contacts: [
        { name: 'Contato Válido', phone: '11999999999' },
        { name: '   ', phone: '11888888888' },
        { name: 'Contato 3', phone: '' },
      ] as ActivateTagParams['data']['emergency_contacts']
    };

    expect(() => TagValidator.validateAll(dataContatosInvalidos)).toThrow(
      expect.objectContaining({
        details: expect.arrayContaining([
          "O nome do 2º contato de emergência é obrigatório.",
          "O telefone do 3º contato de emergência é obrigatório."
        ])
      })
    );
  });
});