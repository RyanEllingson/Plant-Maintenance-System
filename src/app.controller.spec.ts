import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { User } from './users/user.entity';

describe('AppController', () => {
  let appController: AppController;

  beforeAll(async () => {
    const authService: Partial<AuthService> = {
      login(user: User) {
        return Promise.resolve({ access_token: 'this is a signed jwt' });
      },
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, { provide: AuthService, useValue: authService }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
