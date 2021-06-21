import { Test, TestingModule } from '@nestjs/testing';
import { LalamoveService } from './lalamove.service';

describe('LalamoveService', () => {
  let service: LalamoveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LalamoveService],
    }).compile();

    service = module.get<LalamoveService>(LalamoveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
