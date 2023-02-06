import { YooCheckout } from '@a2seven/yoo-checkout';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma.service';
import { AbstractProvider } from './abstract.provider';
import { fee } from './constants/fee';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';

export class YookassaProvider extends AbstractProvider {
  private readonly yooCheckout: YooCheckout;

  constructor(
    protected readonly configService: ConfigService,
    protected readonly prismaService: PrismaService,
  ) {
    super(configService, prismaService);
    this.yooCheckout = new YooCheckout({
      shopId: configService.get<string>('YOOKASSA_SHOP_ID'),
      secretKey: configService.get<string>('YOOKASSA_SECRET_KEY'),
    });
  }

  async create(
    projectId: number,
    createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    const wallet = await this.prismaService.wallet.findUniqueOrThrow({
      where: {
        projectId,
      },
    });

    if (wallet.currency !== 'RUB') {
      throw new BadRequestException(
        'You can issue invoices and accept payments via yookassa only in rubles.',
      );
    }

    const payment = await this.yooCheckout.createPayment({
      capture: true,
      amount: {
        value: this.getAmount(createPaymentDto.amount, fee.yookassa.BANK_CARD),
        currency: wallet.currency,
      },
      payment_method_data: {
        type: 'bank_card',
      },
      confirmation: {
        type: 'redirect',
        return_url: this.configService.get<string>('YOOKASSA_REDIRECT'),
      },
    });

    return Object.assign(
      await this.prismaService.payment.create({
        data: {
          id: payment.id,
          projectId,
          amount: new Decimal(payment.amount.value),
          status: PaymentStatus.Pending,
        },
      }),
      {
        payload: {
          url: payment.confirmation.confirmation_url,
        },
      },
    );
  }

  async handle(body: any): Promise<void> {
    if (!body.object) {
      return;
    }

    const payment = await this.prismaService.payment.findUniqueOrThrow({
      where: {
        id: body.object.id,
      },
    });

    switch (body.event) {
      case 'payment.succeeded':
        return this.handleSucceeded(payment);

      case 'payment.canceled':
        return this.handleCanceled(payment);
    }
  }

  private async handleSucceeded(payment: Payment): Promise<void> {
    if (payment.status === PaymentStatus.Pending) {
      await this.prismaService.$transaction([
        this.prismaService.wallet.update({
          where: {
            projectId: payment.projectId,
          },
          data: {
            currentBalance: {
              increment: payment.amount,
            },
          },
        }),
        this.prismaService.payment.update({
          where: {
            id: payment.id,
          },
          data: {
            status: PaymentStatus.Succeeded,
          },
        }),
      ]);
    }
  }

  private async handleCanceled(payment: Payment): Promise<void> {
    await this.prismaService.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: PaymentStatus.Canceled,
      },
    });
  }

  private getAmount(amount: number, fee = 10): string {
    amount = (amount / (100 - fee)) * 100;
    return String(Math.ceil(amount * 100) / 100);
  }
}
