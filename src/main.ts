import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetting } from './setting/app.setting';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appSetting(app);
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
