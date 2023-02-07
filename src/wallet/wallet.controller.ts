import { Controller, ParseIntPipe, SerializeOptions } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { FindAllWalletsDto } from './dto/find-all-wallets.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';
import { WalletService } from './wallet.service';

@SerializeOptions({
  type: Wallet,
})
@Controller()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @MessagePattern('createWallet')
  create(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() createWalletDto: CreateWalletDto,
  ): Promise<Wallet> {
    return this.walletService.create(projectId, createWalletDto);
  }

  @MessagePattern('findAllWallets')
  findAll(@Payload() findAllWalletsDto: FindAllWalletsDto): Promise<Wallet[]> {
    return this.walletService.findAll(findAllWalletsDto);
  }

  @MessagePattern('findOneWallet')
  findOne(
    @Payload('projectId', ParseIntPipe) projectId: number,
  ): Promise<Wallet> {
    return this.walletService.findOne(projectId);
  }

  @MessagePattern('updateWallet')
  update(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() updateWalletDto: UpdateWalletDto,
  ): Promise<Wallet> {
    return this.walletService.update(projectId, updateWalletDto);
  }

  @MessagePattern('removeWallet')
  remove(
    @Payload('projectId', ParseIntPipe) projectId: number,
  ): Promise<Wallet> {
    return this.walletService.remove(projectId);
  }
}
