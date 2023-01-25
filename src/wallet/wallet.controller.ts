import { Controller, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PlainToClassInterceptor } from 'src/shared/interceptors/plain-to-class.interceptor';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { FindAllWalletsDto } from './dto/find-all-wallets.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';
import { WalletService } from './wallet.service';

@Controller()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @MessagePattern('createWallet')
  @UseInterceptors(new PlainToClassInterceptor(Wallet))
  create(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() createWalletDto: CreateWalletDto,
  ): Promise<Wallet> {
    return this.walletService.create(projectId, createWalletDto);
  }

  @MessagePattern('findAllWallets')
  @UseInterceptors(new PlainToClassInterceptor(Wallet))
  findAll(@Payload() findAllWalletsDto: FindAllWalletsDto): Promise<Wallet[]> {
    return this.walletService.findAll(findAllWalletsDto);
  }

  @MessagePattern('findOneWallet')
  @UseInterceptors(new PlainToClassInterceptor(Wallet))
  findOne(
    @Payload('projectId', ParseIntPipe) projectId: number,
  ): Promise<Wallet> {
    return this.walletService.findOne(projectId);
  }

  @MessagePattern('updateWallet')
  @UseInterceptors(new PlainToClassInterceptor(Wallet))
  update(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() updateWalletDto: UpdateWalletDto,
  ): Promise<Wallet> {
    return this.walletService.update(projectId, updateWalletDto);
  }

  @MessagePattern('removeWallet')
  @UseInterceptors(new PlainToClassInterceptor(Wallet))
  remove(
    @Payload('projectId', ParseIntPipe) projectId: number,
  ): Promise<Wallet> {
    return this.walletService.remove(projectId);
  }
}
