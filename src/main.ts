import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  app.enableCors();
  // app.useStaticAssets(`${__dirname}/asset`);
  // the next two lines did the trick
  app.useBodyParser('json', { limit: '50mb' });
  // await app.listen(3000);
  await app.listen(3001);
}
bootstrap();
