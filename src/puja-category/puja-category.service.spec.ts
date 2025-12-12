import { Test, TestingModule } from '@nestjs/testing';
import { PujaCategoryService } from './puja-category.service';

describe('PujaCategoryService', () => {
  let service: PujaCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PujaCategoryService],
    }).compile();

    service = module.get<PujaCategoryService>(PujaCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
