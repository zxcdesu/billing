import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CheckMessagingLimitDto } from './dto/check-messaging-limit.dto';
import { HandleMessagingLimitDto } from './dto/handle-messaging-limit.dto';
import { MessagingLimitService } from './messaging-limit.service';

@Controller()
export class MessagingLimitController {
  constructor(private readonly messagingLimitService: MessagingLimitService) {}

  @MessagePattern('checkMessagingLimit')
  check(
    @Payload() checkMessagingLimitDto: CheckMessagingLimitDto,
  ): Promise<boolean> {
    return this.messagingLimitService.check(checkMessagingLimitDto);
  }

  @MessagePattern('handleMessagingLimit')
  handle(
    @Payload() handleMessagingLimitDto: HandleMessagingLimitDto,
  ): Promise<boolean> {
    return this.messagingLimitService.handle(handleMessagingLimitDto);
  }
}
