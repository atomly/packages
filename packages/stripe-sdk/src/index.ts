interface CrudService {
  create(...args: unknown[]): unknown;
  read(...args: unknown[]): unknown;
  readList(...args: unknown[]): unknown;
  update(...args: unknown[]): unknown;
  delete(...args: unknown[]): unknown;
}
