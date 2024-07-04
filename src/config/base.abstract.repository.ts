import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import {
  PaginateQuery,
  Paginated,
  paginate,
  PaginateConfig,
} from 'nestjs-paginate';
import { FindOptions } from './base.repository.interface';

export abstract class BaseAbstractRepository<T> {
  private readonly repository: Repository<T>;
  private readonly paginatedConfig: PaginateConfig<T>;
  constructor(repository: Repository<T>, paginated_config: PaginateConfig<T>) {
    this.repository = repository;
    this.paginatedConfig = paginated_config;
  }

  public async create(data: DeepPartial<T>): Promise<T> {
    const entity = await this.repository.create(data);
    return this.repository.save(entity);
  }

  public async save(data: T): Promise<T> {
    return await this.repository.save(data);
  }

  public async findOneById(id: number): Promise<T> {
    return await this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
    });
  }

  public async findOne(options: FindOptions<T>): Promise<T> {
    const queryOption: FindOneOptions<T> = {
      where: {
        ...options.where,
      },
    } as FindOneOptions;
    return await this.repository.findOne(queryOption);
  }

  public async findAll(query: PaginateQuery): Promise<Paginated<T>> {
    return paginate(query, this.repository, this.paginatedConfig);
  }

  public async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  public async softDeleteById(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

  public async update(id: number, data: DeepPartial<T>): Promise<T> {
    const obj = await this.findOneById(id);
    return this.repository.save({
      ...obj,
      ...data,
    });
  }
}
