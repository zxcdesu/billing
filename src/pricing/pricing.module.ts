import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { PricingService } from './pricing.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://whatsapp-support.gupshup.io/wabamanager/pricingDetails',
    }),
    CacheModule.register({
      ttl: 0,
    }),
  ],
  providers: [PricingService],
  exports: [PricingService],
})
export class PricingModule {}
