import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';
import { PaymentProvider } from './enums/payment-provider.enum';
import { ProviderRepository } from './provider.repository';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentProviderRepository: ProviderRepository) {}

  async create(
    projectId: number,
    createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    return this.paymentProviderRepository
      .get(createPaymentDto.provider)
      .create(projectId, createPaymentDto);
  }

  async handleYookassa(body: any): Promise<void> {
    return this.paymentProviderRepository
      .get(PaymentProvider.Yookassa)
      .handle(body);
  }
}
