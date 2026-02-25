import { AuthGuard } from '@nestjs/passport';
import { AuthUnAuthenticatedException } from '../auth.errors';

export class JwtGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (!user || err) {
      throw new AuthUnAuthenticatedException();
    }
    return user;
  }
}

export class JwtOptionalGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    return user || null;
  }
}
