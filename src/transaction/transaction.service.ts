import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(projectId: number): Promise<Transaction[]> {
    return this.prismaService.transaction.findMany({
      where: {
        projectId,
      },
    });
  }
}
