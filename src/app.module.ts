import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { RedisModule } from './infrastructure/redis/redis.module';
import { AppService } from './service/app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './domain/session.interceptor';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';

@Module({
  imports: [RedisModule],
  controllers: [AppController, AuthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    AppService,
    AuthService,
  ],
})
export class AppModule {}
