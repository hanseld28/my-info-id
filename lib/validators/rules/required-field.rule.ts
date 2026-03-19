import { ValidationRule } from '../core/validation-rule.interface';

export class RequiredFieldRule<T> implements ValidationRule<T> {
  constructor(private field: keyof T, private errorMessage: string) {}

  validate(data: T): string | null {
    const value = data[this.field];

    if (!value || typeof value !== 'string' || !value.trim()) {
      return this.errorMessage;
    }
    
    return null;
  }
}