import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';

export abstract class AbstractProvider {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly prismaService: PrismaService,
  ) {}

  abstract create(
    projectId: number,
    createPaymentDto: CreatePaymentDto,
  ): Promise<Payment>;

  abstract handle(body: any): Promise<void>;
}
