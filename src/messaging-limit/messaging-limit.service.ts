import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PricingService } from 'src/pricing/pricing.service';
import { PrismaService } from 'src/prisma.service';
import { messagingLimit } from './constants/messaging-limit';
import { CheckMessagingLimitDto } from './dto/check-messaging-limit.dto';
import { HandleMessagingLimitDto } from './dto/handle-messaging-limit.dto';
import { MessagingLimitUtils } from './messaging-limit.utils';

@Injectable()
export class MessagingLimitService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly prismaService: PrismaService,
    private readonly pricingService: PricingService,
  ) {}

  async check(
    checkMessagingLimitDto: CheckMessagingLimitDto,
  ): Promise<boolean> {
    const [month, year] = MessagingLimitUtils.getMonthAndYear();
    const key = [
      checkMessagingLimitDto.projectId,
      checkMessagingLimitDto.channelId,
      year,
      month,
    ].join('_');

    let value = await this.cache.get<boolean>(key);
    if (typeof value === 'boolean') {
      return value;
    }

    const messagingQuota = await this.prismaService.messagingQuota.upsert({
      where: {
        projectId_channelId_year_month: {
          ...checkMessagingLimitDto,
          year,
          month,
        },
      },
      create: {
        projectId: checkMessagingLimitDto.projectId,
        channelId: checkMessagingLimitDto.channelId,
        year,
        month,
      },
      update: {},
      select: {
        value: true,
      },
    });

    value = messagingQuota.value < messagingLimit.FREE_PER_MONTH;

    await this.cache.set(key, value);
    return value;
  }

  handle(handleMessagingLimitDto: HandleMessagingLimitDto): Promise<boolean> {
    return this.prismaService.$transaction(async (tx) => {
      const [month, year] = MessagingLimitUtils.getMonthAndYear();
      const key = [
        handleMessagingLimitDto.projectId,
        handleMessagingLimitDto.channelId,
        year,
        month,
      ].join('_');

      let wallet = await tx.wallet.findUniqueOrThrow({
        where: {
          projectId: handleMessagingLimitDto.projectId,
        },
      });

      const bill = handleMessagingLimitDto.billable
        ? await this.pricingService
            .get(wallet)
            .then((pricing) => pricing[handleMessagingLimitDto.type])
        : undefined;

      await tx.transaction.create({
        data: {
          projectId: handleMessagingLimitDto.projectId,
          type: handleMessagingLimitDto.type,
          billable: handleMessagingLimitDto.billable,
          bill,
        },
      });

      if (!handleMessagingLimitDto.billable) {
        const messagingQuota = await tx.messagingQuota.upsert({
          where: {
            projectId_channelId_year_month: {
              projectId: handleMessagingLimitDto.projectId,
              channelId: handleMessagingLimitDto.channelId,
              year,
              month,
            },
          },
          create: {
            projectId: handleMessagingLimitDto.projectId,
            channelId: handleMessagingLimitDto.channelId,
            year,
            month,
            value: 1,
          },
          update: {
            value: {
              increment: 1,
            },
          },
          select: {
            value: true,
          },
        });

        this.cache
          .set(key, messagingQuota.value < messagingLimit.FREE_PER_MONTH)
          .catch(() => {
            this.cache.reset().catch(() => undefined);
          });
      } else {
        wallet = await tx.wallet.update({
          where: {
            projectId: handleMessagingLimitDto.projectId,
          },
          data: {
            currentBalance: {
              decrement: bill,
            },
          },
        });

        this.cache
          .set(key, wallet.currentBalance > messagingLimit.MINIMUM_BALANCE)
          .catch(() => {
            this.cache.reset().catch(() => undefined);
          });
      }

      return true;
    });
  }
}
