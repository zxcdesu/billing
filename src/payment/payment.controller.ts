import {
  Body,
  Controller,
  ParseIntPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PlainToClassInterceptor } from 'src/shared/interceptors/plain-to-class.interceptor';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern('createPayment')
  @UseInterceptors(new PlainToClassInterceptor(Payment))
  async create(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    return this.paymentService.create(projectId, createPaymentDto);
  }

  @Post('yookassa')
  handleYookassa(@Body() body: any): Promise<void> {
    return this.paymentService.handleYookassa(body);
  }
}
