import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisService } from './redis.service';
import { randomUUID } from 'crypto';
import axios from 'axios';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @Inject(RedisService) private readonly redisService: RedisService,
  ) {}

  async signIn(data: any, res: Response): Promise<any> {
    const sessionId = randomUUID();

    try {
      const session = await axios.post(
        `${process.env.BASE_URI}/auth/login`,
        data,
      );

      await this.redisService.saveSession(`${sessionId}`, session.data);

      res.cookie('session', sessionId);

      res.status(201).send({ session: sessionId });
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }
}
