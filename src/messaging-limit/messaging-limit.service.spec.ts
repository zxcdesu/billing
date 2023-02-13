import { Test, TestingModule } from '@nestjs/testing';
import { MessagingLimitService } from './messaging-limit.service';

describe('MessagingLimitService', () => {
  let service: MessagingLimitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagingLimitService],
    }).compile();

    service = module.get<MessagingLimitService>(MessagingLimitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
