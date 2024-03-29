import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  controllers: [WalletController],
  providers: [PrismaService, WalletService],
})
export class WalletModule {}
