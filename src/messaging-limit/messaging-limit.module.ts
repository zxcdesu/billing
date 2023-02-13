import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/common/cache/cache.module';
import { PricingModule } from 'src/pricing/pricing.module';
import { PrismaService } from 'src/prisma.service';
import { MessagingLimitController } from './messaging-limit.controller';
import { MessagingLimitService } from './messaging-limit.service';

@Module({
  imports: [
    PricingModule,
    CacheModule.register({
      ttl: 0,
    }),
  ],
  controllers: [MessagingLimitController],
  providers: [MessagingLimitService, PrismaService],
})
export class MessagingLimitModule {}
