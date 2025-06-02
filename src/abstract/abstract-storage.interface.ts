import { AbstractEntity } from './abstract.entity';

export interface IAbstractStorage<
  Entity extends AbstractEntity,
  CreateDto,
  UpdateDto,
> {
  getAll: () => Promise<Entity[]>;
  getById: (id: string) => Promise<Entity | null>;
  filterByIds: (id: string[]) => Promise<Entity[]>;
  create: (dto: CreateDto) => Promise<Entity>;
  update: (id: string, dto: UpdateDto) => Promise<Entity | null>;
  delete: (id: string) => Promise<boolean>;
}
