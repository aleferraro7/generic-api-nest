import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { ROLES } from 'src/constants/roles';

export class UserDTO {
  @ApiProperty({
    description: 'Username',
    example: 'John23',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'User mail',
    example: 'johndoe@mail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: '123456',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User role',
    example: 'USER',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(ROLES)
  role: ROLES;
}

export class CreateUserDTO {
  @ApiProperty({
    description: 'Username',
    example: 'John23',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'User mail',
    example: 'johndoe@mail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: '123456',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User role',
    example: 'USER',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(ROLES)
  role: ROLES;
}

export class UpdateUserDTO extends PartialType(UserDTO) {}
