import { TransactionType } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt } from 'class-validator';

export class HandleMessagingLimitDto {
  @IsInt()
  projectId: number;

  @IsInt()
  channelId: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsBoolean()
  billable: boolean;
}
