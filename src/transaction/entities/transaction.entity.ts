import Prisma from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { Exclude, Type } from 'class-transformer';

export class Transaction implements Prisma.Transaction {
  id: string;

  @Exclude()
  projectId: number;

  type: Prisma.TransactionType;

  @Type(() => Number)
  bill: Decimal;

  billable: boolean;

  createdAt: Date;
}
