import { Test, TestingModule } from '@nestjs/testing';
import { PujaCategoryController } from './puja-category.controller';

describe('PujaCategoryController', () => {
  let controller: PujaCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PujaCategoryController],
    }).compile();

    controller = module.get<PujaCategoryController>(PujaCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
