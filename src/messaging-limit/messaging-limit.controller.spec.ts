import { Test, TestingModule } from '@nestjs/testing';
import { MessagingLimitController } from './messaging-limit.controller';
import { MessagingLimitService } from './messaging-limit.service';

describe('MessagingLimitController', () => {
  let controller: MessagingLimitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagingLimitController],
      providers: [MessagingLimitService],
    }).compile();

    controller = module.get<MessagingLimitController>(MessagingLimitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
