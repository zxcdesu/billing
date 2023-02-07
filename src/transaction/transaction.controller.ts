import { Controller, SerializeOptions } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';

@SerializeOptions({
  type: Transaction,
})
@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @MessagePattern('findAllTransactions')
  findAll(
    @Payload('projectId', ParseIntPipe) projectId: number,
  ): Promise<Transaction[]> {
    return this.transactionService.findAll(projectId);
  }
}
