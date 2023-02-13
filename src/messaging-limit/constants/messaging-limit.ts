import { Prisma } from '@prisma/client';

export const messagingLimit = {
  FREE_PER_MONTH: 1000,
  MINIMUM_BALANCE: new Prisma.Decimal(0),
};
