import { FindOneOptions } from 'typeorm';

export interface BaseInterfaceRepository<T> {
  create(data: T): Promise<T>;

  save(data: T): Promise<T>;

  update(id: any, data: Partial<T>): Promise<T>;

  findOneById(id: any): Promise<T>;

  findAll(): Promise<T[]>;

  deleteById(id: number): Promise<void>;

  softDeleteById(id: number): Promise<void>;

  findOne(options: FindOneOptions<T>): Promise<T>;
}

export type FindOptions<T> = Pick<FindOneOptions<T>, 'where'>;
