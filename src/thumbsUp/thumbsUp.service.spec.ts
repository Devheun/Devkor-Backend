import { Test, TestingModule } from '@nestjs/testing';
import { ThumbsUpService } from './thumbsUp.service';

describe('LikeService', () => {
  let service: ThumbsUpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThumbsUpService],
    }).compile();

    service = module.get<ThumbsUpService>(ThumbsUpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
