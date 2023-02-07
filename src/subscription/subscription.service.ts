import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { Decimal } from '@prisma/client/runtime';
import { add } from 'date-fns';
import { PrismaService } from 'src/prisma.service';
import { subscription } from './constants/subscription';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  create(projectId: number): Promise<Subscription> {
    return this.prismaService.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUniqueOrThrow({
        where: {
          projectId,
        },
        select: {
          currency: true,
          currentBalance: true,
          subscription: {
            select: {
              expiresAt: true,
            },
          },
        },
      });

      if (typeof subscription.PRICE[wallet.currency] === 'undefined') {
        throw new Error(
          `The ${wallet.currency} currency is not currently supported for subscription payments`,
        );
      }

      Object.assign(
        wallet,
        await tx.wallet.update({
          where: {
            projectId,
          },
          data: {
            currentBalance: {
              decrement: subscription.PRICE[wallet.currency],
            },
          },
          select: {
            currentBalance: true,
          },
        }),
      );

      if (wallet.currentBalance < new Decimal(0)) {
        throw new Error('Insufficient balance to purchase a subscription');
      }

      return await tx.subscription.upsert({
        where: {
          projectId,
        },
        create: {
          projectId,
          expiresAt: add(new Date(), {
            months: subscription.DURATION,
          }),
        },
        update: {
          expiresAt: wallet.subscription
            ? add(wallet.subscription.expiresAt, {
                months: subscription.DURATION,
              })
            : undefined,
        },
      });
    });
  }

  @Cron(CronExpression.EVERY_5_MINUTES, {
    name: SubscriptionService.name,
  })
  async cron(): Promise<void> {
    const cronJob = this.schedulerRegistry.getCronJob(SubscriptionService.name);

    cronJob.stop();

    try {
      await this.prismaService.subscription.deleteMany({
        where: {
          expiresAt: {
            lte: new Date(),
          },
        },
      });
    } catch (e) {
      this.logger.error(
        'Error when performing the operation of deleting expired subscriptions',
        e,
      );
    } finally {
      cronJob.start();
    }
  }
}
