import { PaginateQuery, Paginated } from 'nestjs-paginate';
import { BaseAbstractRepository } from './base.abstract.repository';
import { DeepPartial } from 'typeorm';
import { FindOptions } from './base.repository.interface';
import { ErrorManager } from 'src/utils/error.manager';

export abstract class BaseService<T> {
  constructor(private readonly baseRepository: BaseAbstractRepository<T>) {}

  public async create(data: T): Promise<T> {
    return await this.baseRepository.create(data);
  }

  public async save(data: T): Promise<T> {
    return await this.baseRepository.save(data);
  }

  public async findOneById(id: number): Promise<T> {
    try {
      const entity = await this.baseRepository.findOneById(id);
      if (!entity) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Not found',
        });
      }
      return entity;
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }

  public async findOne(options: FindOptions<T>): Promise<T> {
    try {
      const entity = await this.baseRepository.findOne(options);
      if (!entity) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Not found',
        });
      }
      return entity;
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }

  public async findAll(query: PaginateQuery): Promise<Paginated<T>> {
    try {
      const entities = await this.baseRepository.findAll(query);
      if (!entities) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Not found',
        });
      }
      return entities;
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }

  public async deleteById(id: number): Promise<void> {
    try {
      const entity = await this.baseRepository.findOneById(id);
      if (!entity) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Not found',
        });
      }
      await this.baseRepository.deleteById(id);
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }

  public async softDeleteById(id: number): Promise<void> {
    try {
      const entity = await this.baseRepository.findOneById(id);
      if (!entity) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Not found',
        });
      }
      await this.baseRepository.softDeleteById(id);
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }

  public async update(id: number, data: DeepPartial<T>): Promise<T> {
    try {
      const entity = await this.baseRepository.findOneById(id);
      if (!entity) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Not found',
        });
      }
      return await this.baseRepository.update(id, data);
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }
}
