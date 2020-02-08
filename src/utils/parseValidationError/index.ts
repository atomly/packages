// Libraries
import { ValidationError } from "class-validator";

export function parseValidationErrors(errors: ValidationError[], type?: string): string {
  const errorMessage = errors.map(({ constraints }) => {
    return Object.values(constraints)
      .map((message, index) => `${index + 1}. ${message}`)
      .join(' - ')
  }).join(' | ');
  return `[VALIDATION ${type?.toUpperCase()} ERROR]: ${errorMessage}`;
}
