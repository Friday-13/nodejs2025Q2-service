export default class RecordAlreadyExists extends Error {
  constructor(entity: string, fieldValue: string, fieldName: string) {
    super(`${entity} with ${fieldName} ${fieldValue} already exists`);
  }
}
