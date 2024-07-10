import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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
import { Roles } from 'src/auth/decorators/roles.decorator';
// import { Auth } from 'src/auth/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.USER)
@ApiTags('USERS')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
    return await this.usersService.findOneById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDTO) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Roles(ROLES.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.usersService.deleteById(id);
  }
}
