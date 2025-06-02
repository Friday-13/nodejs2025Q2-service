export default class RecordDoesntExist extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} with id ${id} doesn't exist`);
  }
}
