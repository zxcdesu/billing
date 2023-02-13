import { TransactionType } from '@prisma/client';
import { Pricing } from '../interfaces/pricing.interface';

export const pricing: Pricing = {
  RU: {
    RUB: {
      [TransactionType.BIC]: 6,
      [TransactionType.UIC]: 4,
    },
  },
};
