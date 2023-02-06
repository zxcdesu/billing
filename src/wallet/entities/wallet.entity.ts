import Prisma from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { Exclude, Type } from 'class-transformer';
import { MessagingQuota } from './messaging-quota.entity';
import { Subscription } from './subscription.entity';

export class Wallet implements Prisma.Wallet {
  @Exclude()
  projectId: number;

  country: string;

  currency: string;

  @Type(() => Number)
  currentBalance: Decimal;

  @Type(() => MessagingQuota)
  messagingQuota: MessagingQuota[];

  @Type(() => Subscription)
  subscription: Subscription | null;
}
