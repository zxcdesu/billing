import { TransactionType } from '@prisma/client';

export interface Pricing {
  [country: string]: {
    [currency: string]: {
      [TransactionType.BIC]: number;
      [TransactionType.UIC]: number;
    };
  };
}
