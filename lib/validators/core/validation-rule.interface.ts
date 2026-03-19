export interface ValidationRule<T> {
  validate(data: T): string | string[] | null;
}