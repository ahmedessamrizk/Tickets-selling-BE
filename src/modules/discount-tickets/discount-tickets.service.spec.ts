import { Test, TestingModule } from '@nestjs/testing';
import { DiscountTicketsService } from './discount-tickets.service';

describe('DiscountTicketsService', () => {
  let service: DiscountTicketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscountTicketsService],
    }).compile();

    service = module.get<DiscountTicketsService>(DiscountTicketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
