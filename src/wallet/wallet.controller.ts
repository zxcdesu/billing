import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletService } from './wallet.service';

@Controller()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @MessagePattern('wallet.create')
  create(@Payload('payload') createWalletDto: CreateWalletDto) {
    return this.walletService.create(NaN, createWalletDto);
  }

  @MessagePattern('wallet.findAll')
  findAll() {
    return this.walletService.findAll();
  }

  @MessagePattern('wallet.findOne')
  findOne() {
    return this.walletService.findOne(NaN);
  }

  @MessagePattern('wallet.update')
  update(@Payload('payload') updateWalletDto: UpdateWalletDto) {
    return this.walletService.update(updateWalletDto);
  }

  @MessagePattern('wallet.remove')
  remove() {
    return this.walletService.remove(NaN);
  }
}
