import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from 'src/constants/key-decorator';

export const RolesAccess = (...roles: string[]) =>
  SetMetadata(ROLES_KEY, roles);
