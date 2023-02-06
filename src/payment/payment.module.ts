import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProviderRepository } from './provider.repository';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, ProviderRepository, PrismaService],
})
export class PaymentModule {}
