import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const expressApp = app.getHttpAdapter().getInstance();
  if (
    typeof expressApp.set === 'function' &&
    (process.env.TRUST_PROXY === 'true' || process.env.TRUST_PROXY === '1')
  ) {
    expressApp.set('trust proxy', 1);
  }

  app.use(cookieParser());
  const clientOrigin =
    process.env.CLIENT_ORIGIN?.replace(/\/$/, '') ?? 'http://localhost:5173';
  app.enableCors({
    origin: clientOrigin,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
