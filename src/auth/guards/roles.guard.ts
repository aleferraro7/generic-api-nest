import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_KEY, ROLES_KEY } from 'src/constants/key-decorator';
import { ROLES } from 'src/constants/roles';
import { ErrorManager } from 'src/utils/error.manager';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const isPublic = this.reflector.get<boolean>(
        PUBLIC_KEY,
        context.getHandler(),
      );

      if (isPublic) {
        return true;
      }

      const requiredRoles = this.reflector.getAllAndOverride<ROLES>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      console.log(requiredRoles);

      if (!requiredRoles) {
        return true;
      }

      const { user } = context.switchToHttp().getRequest();

      if (user.role !== requiredRoles) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'The user is not authorized',
        });
      }

      return true;
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }
}
