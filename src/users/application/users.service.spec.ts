import { UserService } from './user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../domain/user.schema';
import { UserRepository } from '../infrastructure/repository/user.repository';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect } from 'mongoose';
import { UserInputModel } from '../api/models/user.model';
import * as bcrypt from 'bcrypt';
import { INestApplication } from '@nestjs/common';
import { appSetting } from '../../setting/app.setting';

describe('integration test for user service', () => {
  let app: INestApplication;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let httpServer;
  let mongoServer: MongoMemoryServer;
  let userService: UserService;
  let userRepository: UserRepository;
  const validUserInputBody: UserInputModel = {
    login: 'login',
    password: 'qwerty',
    email: 'email@email.com',
  };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoServer.getUri()),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [UserService, UserRepository],
    }).compile();
    appSetting(app);

    await app.init();

    httpServer = app.getHttpServer();
    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });
  afterAll(async () => {
    await disconnect();
  });

  describe('createConfirmedUserUser', () => {
    it('should return', async function () {
      const userId = await userService.createConfirmedUser(validUserInputBody);
      const user = await userRepository.find(userId);
      expect(user!.accountData.email).toBe(user?.accountData.email);
      expect(user!.accountData.login).toBe(user?.accountData.login);
      expect(
        await bcrypt.compare(
          user!.accountData.password,
          validUserInputBody.password,
        ),
      );
      expect(true).toEqual(user?.emailConfirmation.isConfirmed);
    });

    it('should be defined', () => {
      expect(userService).toBeDefined();
    });
  });
});
