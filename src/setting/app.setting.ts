import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { pipeFilterOptions } from './pipe.filter';
import { HttpExceptionFilter } from './exeptions.filter';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';

export const appSetting = (app: INestApplication) => {
  app.use(cookieParser());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe(pipeFilterOptions));
  app.useGlobalFilters(new HttpExceptionFilter());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
};
