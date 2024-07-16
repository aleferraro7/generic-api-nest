import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { BaseService } from 'src/config/base.service';
import { User } from './entities/user.entity';
import { ErrorManager } from 'src/utils/error.manager';
import { UsersRepository } from './users.repository';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(private readonly usersRepository: UsersRepository) {
    super(usersRepository);
  }

  public async findByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'User not found',
        });
      }
      return user;
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }

  public async register(body: UserDTO): Promise<User> {
    try {
      const isExistUser = await this.findExistUser(body.email, body.username);

      if (isExistUser) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'User already exists',
        });
      }

      body.password = await bcrypt.hash(body.password, 10);
      return await this.usersRepository.save(body);
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }

  private async findExistUser(email: string, username: string) {
    const existEmail = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (existEmail) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'User with this email already exists',
      });
    }

    const existUsername = await this.usersRepository.findOne({
      where: {
        username,
      },
    });

    if (existUsername) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'User with this username already exists',
      });
    }

    return false;
  }
}
