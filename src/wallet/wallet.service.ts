import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { FindAllWalletsDto } from './dto/find-all-wallets.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(private readonly prismaService: PrismaService) {}

  create(projectId: number, createWalletDto: CreateWalletDto): Promise<Wallet> {
    return this.prismaService.wallet.create({
      data: {
        projectId,
        ...createWalletDto,
      },
      include: {
        messagingQuota: true,
        subscription: true,
      },
    });
  }

  findAll(findAllWalletsDto: FindAllWalletsDto): Promise<Wallet[]> {
    return this.prismaService.wallet.findMany({
      where: {
        projectId: {
          in: findAllWalletsDto.projectIds,
        },
      },
      include: {
        messagingQuota: true,
        subscription: true,
      },
    });
  }

  findOne(projectId: number): Promise<Wallet> {
    return this.prismaService.wallet.findUniqueOrThrow({
      where: {
        projectId,
      },
      include: {
        messagingQuota: true,
        subscription: true,
      },
    });
  }

  update(projectId: number, updateWalletDto: UpdateWalletDto): Promise<Wallet> {
    return this.prismaService.wallet.update({
      where: {
        projectId,
      },
      data: updateWalletDto,
      include: {
        messagingQuota: true,
        subscription: true,
      },
    });
  }

  remove(projectId: number): Promise<Wallet> {
    return this.prismaService.wallet.delete({
      where: {
        projectId,
      },
      include: {
        messagingQuota: true,
        subscription: true,
      },
    });
  }
}
