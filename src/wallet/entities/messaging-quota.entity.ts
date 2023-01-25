import Prisma from '@prisma/client';
import { Exclude } from 'class-transformer';

export class MessagingQuota implements Prisma.MessagingQuota {
  @Exclude()
  projectId: number;

  channelId: number;

  value: number;

  year: number;

  month: number;
}
