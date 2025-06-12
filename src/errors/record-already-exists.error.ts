export default class RecordAlreadyExists extends Error {
  constructor(entity: string, field: string, fieldValue: string) {
    super(`${entity} with ${field} ${fieldValue} already exists`);
  }
}
