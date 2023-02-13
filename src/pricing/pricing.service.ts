import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { TransactionType, Wallet } from '@prisma/client';
import { Cache } from 'cache-manager';
import { lastValueFrom } from 'rxjs';
import { pricing } from './constants/pricing';
import { Pricing } from './interfaces/pricing.interface';

@Injectable()
export class PricingService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly httpService: HttpService,
  ) {}

  async get(
    wallet: Wallet,
  ): Promise<Pricing[typeof wallet.country][typeof wallet.currency]> {
    let pricingDetails = await this.cache.get<Pricing[typeof wallet.country]>(
      wallet.country,
    );

    if (pricingDetails) {
      return pricingDetails[wallet.currency];
    }

    const res = await lastValueFrom(
      this.httpService.get<{
        pricingDetails: Array<{ rate: number }>;
      }>(`?country=${wallet.country}`),
    );

    pricingDetails = {
      ...pricing[wallet.country],
      USD: {
        [TransactionType.BIC]: res.data.pricingDetails.at(-1).rate,
        [TransactionType.UIC]: res.data.pricingDetails.at(-2).rate,
      },
    };

    await this.cache.set(wallet.country, pricingDetails);
    return pricingDetails[wallet.currency];
  }
}
