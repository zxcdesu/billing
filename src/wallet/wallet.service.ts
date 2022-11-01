import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  create(projectId: number, createWalletDto: CreateWalletDto): Promise<Wallet> {
    throw new NotImplementedException();
  }

  findAll(): Promise<Wallet[]> {
    throw new NotImplementedException();
  }

  findOne(projectId: number): Promise<Wallet> {
    throw new NotImplementedException();
  }

  update(updateWalletDto: UpdateWalletDto): Promise<Wallet> {
    throw new NotImplementedException();
  }

  remove(projectId: number): Promise<Wallet> {
    throw new NotImplementedException();
  }
}
