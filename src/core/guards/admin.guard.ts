import { HTTP_MESSAGES } from '@exceptions/http-exceptions';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log({ user });
    if (user.isAdmin === false) {
      throw new ForbiddenException(HTTP_MESSAGES.ADMIN.ADMINS_ONLY);
    }
    return true;
  }
}
