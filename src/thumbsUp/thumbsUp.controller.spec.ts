import { Test, TestingModule } from '@nestjs/testing';
import { ThumbsUpController } from './thumbsUp.controller';

describe('LikeController', () => {
  let controller: ThumbsUpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThumbsUpController],
    }).compile();

    controller = module.get<ThumbsUpController>(ThumbsUpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
