export default class RecordDoesntExist extends Error {
  constructor(entity: string, fieldValue: string, fieldName: string = 'id') {
    super(`${entity} with ${fieldName} ${fieldValue} doesn't exist`);
  }
}
