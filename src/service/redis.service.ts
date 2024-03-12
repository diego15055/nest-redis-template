import { Inject, Injectable } from '@nestjs/common';
import { RedisPrefixEnum } from '../domain/enum/redis-prefix-enum';
import { RedisRepository } from '../infrastructure/redis/repository/redis.repository';
import { SignInDTO } from '../controller/dto/auth.dto';

const oneDayInSeconds = 60 * 60 * 24;

@Injectable()
export class RedisService {
  constructor(
    @Inject(RedisRepository) private readonly redisRepository: RedisRepository,
  ) {}

  async saveSession(sessionId: string, sessionData: SignInDTO): Promise<void> {
    await this.redisRepository.setWithExpiry(
      RedisPrefixEnum.SESSION,
      sessionId,
      JSON.stringify(sessionData),
      oneDayInSeconds,
    );
  }

  async getSession(sessionId: string): Promise<SignInDTO | null> {
    const session = await this.redisRepository.get(
      RedisPrefixEnum.SESSION,
      sessionId,
    );
    return JSON.parse(session);
  }
}
