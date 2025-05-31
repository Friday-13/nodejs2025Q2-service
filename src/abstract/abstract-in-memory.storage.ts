import { IAbstractStorage } from './abstract-storage.interface';
import { AbstractEntity } from './abstract.entity';

export abstract class InMemoryAbstractStorage<
  Entity extends AbstractEntity,
  CreateDto,
  UpdateDto,
> implements IAbstractStorage<Entity, CreateDto, UpdateDto>
{
  protected storage: Entity[] = [];
  constructor() {}

  async getAll() {
    return this.storage;
  }

  async getById(id: string) {
    return this.storage.find((record) => record.id === id) || null;
  }

  abstract create(dto: CreateDto): Promise<Entity>;

  abstract update(id: string, dto: UpdateDto): Promise<Entity | null>;

  async delete(id: string) {
    const recordIndex = this.storage.findIndex((record) => record.id === id);
    if (recordIndex < 0) {
      return false;
    }
    this.storage.splice(recordIndex, 1);
    return true;
  }
}
