import { Test, TestingModule } from '@nestjs/testing';
import { DiscountTicketsController } from './discount-tickets.controller';

describe('DiscountTicketsController', () => {
  let controller: DiscountTicketsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscountTicketsController],
    }).compile();

    controller = module.get<DiscountTicketsController>(DiscountTicketsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
