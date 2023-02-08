import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import * as Joi from 'joi';
// import { MessagingLimitModule } from './messaging-limit/messaging-limit.module';
import { PaymentModule } from './payment/payment.module';
// import { PricingModule } from './pricing/pricing.module';
import { PrismaService } from './prisma.service';
import { SubscriptionModule } from './subscription/subscription.module';
import { TransactionModule } from './transaction/transaction.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().uri().required(),
        BROKER_URL: Joi.string().uri().required(),
        PORT: Joi.number().port().default(8080),
        YOOKASSA_SHOP_ID: Joi.string().required(),
        YOOKASSA_SECRET_KEY: Joi.string().required(),
        YOOKASSA_REDIRECT: Joi.string().uri().required(),
      }),
    }),
    ScheduleModule.forRoot(),
    // MessagingLimitModule,
    PaymentModule,
    // PricingModule,
    SubscriptionModule,
    TransactionModule,
    WalletModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
