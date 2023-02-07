import { Controller, ParseIntPipe, SerializeOptions } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionService } from './subscription.service';

@SerializeOptions({
  type: Subscription,
})
@Controller()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @MessagePattern('createSubscription')
  create(
    @Payload('projectId', ParseIntPipe) projectId: number,
  ): Promise<Subscription> {
    return this.subscriptionService.create(projectId);
  }
}
