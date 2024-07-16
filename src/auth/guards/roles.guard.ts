import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_KEY, ROLES_KEY } from 'src/constants/key-decorator';
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

      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      console.log(`Role required is ${requiredRoles}`);

      if (!requiredRoles) {
        return true;
      }

      const { user } = context.switchToHttp().getRequest();

      if (!requiredRoles.some((role) => this.hasRole(user.role, role))) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'The user is not authorized',
        });
      }
      console.log(`The user role is ${user.role}`);

      return true;
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }

  private hasRole(userRole: string, requiredRole: string): boolean {
    const roleLevel = {
      USER: 1,
      ADMIN: 2,
      SUPERADMIN: 3,
    };

    return roleLevel[userRole] >= roleLevel[requiredRole];
  }
}
