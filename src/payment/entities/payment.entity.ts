import Prisma from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { Exclude, Type } from 'class-transformer';

export class Payment implements Prisma.Payment {
  id: string;

  @Exclude()
  projectId: number;

  status: Prisma.PaymentStatus;

  @Type(() => Number)
  amount: Decimal;

  payload?: any;
}
