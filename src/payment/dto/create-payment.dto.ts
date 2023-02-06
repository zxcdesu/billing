import { IsEnum, IsNumber } from 'class-validator';
import { PaymentProvider } from '../enums/payment-provider.enum';

export class CreatePaymentDto {
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @IsNumber()
  amount: number;
}
