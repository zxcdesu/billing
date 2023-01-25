import Prisma from '@prisma/client';
import { Exclude } from 'class-transformer';

export class Subscription implements Prisma.Subscription {
  @Exclude()
  projectId: number;

  expiresAt: Date;
}
