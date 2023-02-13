import { IsInt } from 'class-validator';

export class CheckMessagingLimitDto {
  @IsInt()
  projectId: number;

  @IsInt()
  channelId: number;
}
