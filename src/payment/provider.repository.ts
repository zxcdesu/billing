import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { AbstractProvider } from './abstract.provider';
import { PaymentProvider } from './enums/payment-provider.enum';
import { YookassaProvider } from './yookassa.provider';

@Injectable()
export class ProviderRepository {
  private readonly [PaymentProvider.Yookassa] = YookassaProvider;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  get(provider: PaymentProvider): AbstractProvider {
    return new this[provider](this.configService, this.prismaService);
  }
}
