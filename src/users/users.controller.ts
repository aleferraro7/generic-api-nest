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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PublicAccess } from 'src/auth/decorators/public.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.usersService.deleteById(id);
  }
}
