import Prisma from '@prisma/client';
import { Exclude, Transform, Type } from 'class-transformer';
import { MessagingQuota } from './messaging-quota.entity';
import { Subscription } from './subscription.entity';

export class Wallet implements Prisma.Wallet {
  @Exclude()
  projectId: number;

  country: string;

  currency: string;

  @Transform(({ value }) => Number(value) / 10000, {
    toPlainOnly: true,
  })
  currentBalance: bigint;

  @Type(() => MessagingQuota)
  messagingQuota: MessagingQuota[];

  @Type(() => Subscription)
  subscription: Subscription | null;
}
