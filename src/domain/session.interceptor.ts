import {
  Inject,
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { RedisService } from '../service/redis.service';
import axios from 'axios';
import { SignInDTO } from '../controller/dto/auth.dto';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(
    @Inject(RedisService) private readonly redisService: RedisService,
  ) {}

  openJwt(token: string) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  }

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    if (request.url === '/auth/signin') {
      return next.handle().pipe(map((data) => data));
    }

    const sessionId = request?.cookies?.['session'];

    if (!sessionId) {
      new UnauthorizedException('You are not allowed to access this route');
    }

    const session = await this.redisService.getSession(sessionId);

    if (this.openJwt(session.access_token).exp < Date.now() / 1000) {
      const newSession = await axios.post<SignInDTO>('/auth/refresh-token', {
        refreshToken: session.refresh_token,
      });

      await this.redisService.saveSession(sessionId, newSession.data);

      return next.handle().pipe(map((data) => data));
    } else {
      request.access = session.access_token;
    }

    return next.handle().pipe(map((data) => data));
  }
}
