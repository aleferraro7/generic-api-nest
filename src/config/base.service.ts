import { PaginateQuery, Paginated } from 'nestjs-paginate';
import { BaseAbstractRepository } from './base.abstract.repository';
import { DeepPartial } from 'typeorm';
import { FindOptions } from './base.repository.interface';

export abstract class BaseService<T> {
  constructor(private readonly baseRepository: BaseAbstractRepository<T>) {}

  public async create(data: T): Promise<T> {
    return await this.baseRepository.create(data);
  }

  public async save(data: T): Promise<T> {
    return await this.baseRepository.save(data);
  }

  public async findOneById(id: number): Promise<T> {
    return await this.baseRepository.findOneById(id);
  }

  public async findOne(options: FindOptions<T>): Promise<T> {
    return await this.baseRepository.findOne(options);
  }

  public async findAll(query: PaginateQuery): Promise<Paginated<T>> {
    return await this.baseRepository.findAll(query);
  }

  public async deleteById(id: number): Promise<void> {
    await this.baseRepository.deleteById(id);
  }

  public async softDeleteById(id: number): Promise<void> {
    await this.baseRepository.softDeleteById(id);
  }

  public async update(id: number, data: DeepPartial<T>): Promise<T> {
    return await this.baseRepository.update(id, data);
  }
}
