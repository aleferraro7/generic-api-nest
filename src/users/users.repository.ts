import { Injectable } from '@nestjs/common';
import { USER_PAGINATE_CONFIG, User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from 'src/config/base.abstract.repository';

@Injectable()
export class UsersRepository extends BaseAbstractRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    super(usersRepository, USER_PAGINATE_CONFIG);
  }
}
