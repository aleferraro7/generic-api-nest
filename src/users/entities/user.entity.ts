import { Exclude, Expose } from 'class-transformer';
import { BaseEntity } from '../../config/base.entity';
import { ROLES } from '../../constants/roles';
import { Column, Entity } from 'typeorm';
import { PaginateConfig } from 'nestjs-paginate';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  @Expose()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: ROLES })
  role: ROLES;
}

export const USER_PAGINATE_CONFIG: PaginateConfig<User> = {
  sortableColumns: [
    'id',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'username',
    'email',
    'role',
  ],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: [
    'id',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'username',
    'email',
    'role',
  ],
};
