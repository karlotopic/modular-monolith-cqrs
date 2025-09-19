import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IJwtProvider } from '../jwt.provider';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject('IJwtProvider') private jwtProvider: IJwtProvider) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException();
    }

    // We could also implement RBAC (role-based access control) to restrict which endpoints are accessible to different types of users.

    const [authType, token] = authHeader.split(' ');
    if (authType !== 'Bearer' || !token) {
      throw new UnauthorizedException();
    }

    try {
      this.jwtProvider.verifyToken(token) as any;
      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
