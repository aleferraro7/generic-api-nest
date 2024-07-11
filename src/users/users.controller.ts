import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDTO, UserDTO } from './dto/user.dto';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { User, USER_PAGINATE_CONFIG } from './entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PublicAccess } from 'src/auth/decorators/public.decorator';
import { ROLES } from 'src/constants/roles';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesAccess } from 'src/auth/decorators/roles.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@RolesAccess(ROLES.USER)
@ApiTags('USERS')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: Logger,
  ) {}

  @PublicAccess()
  @Post()
  async create(@Body() createUserDto: UserDTO) {
    return this.usersService.register(createUserDto);
  }

  @Get()
  @ApiOkPaginatedResponse(User, USER_PAGINATE_CONFIG)
  @ApiPaginationQuery(USER_PAGINATE_CONFIG)
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.usersService.findAll(query);
  }

  @Get(':id')
  async findOneById(@Param('id') id: number) {
    try {
      return await this.usersService.findOneById(id);
    } catch {
      this.logger.error('Not found user'), UsersController.name;
    }
  }

  @RolesAccess(ROLES.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDTO) {
    return await this.usersService.update(id, updateUserDto);
  }

  @RolesAccess(ROLES.SUPERADMIN)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.usersService.deleteById(id);
  }
}
