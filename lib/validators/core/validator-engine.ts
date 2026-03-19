import { ValidationRule } from './validation-rule.interface';
import { ValidationError } from '@/lib/errors/custom-errors';

export class ValidatorEngine<T> {
  constructor(private rules: ValidationRule<T>[], private defaultErrorMessage: string) {}

  validateAll(data: T) {
    const errors: string[] = [];

    for (const rule of this.rules) {
      const result = rule.validate(data);
      if (result) {
        if (!Array.isArray(result)) {
          errors.push(result);
          continue;
        }
        errors.push(...result);
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(this.defaultErrorMessage, errors);
    }
  }
}