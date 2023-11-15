import 'dotenv/config';

import { NestFactory    } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService  } from '@nestjs/config';

import { AppModule           } from './app.module';
import { swaggerSetup        } from './util/swagger-setup';
import { HttpExceptionFilter } from './common/exception/common.exception';

declare const module: any;

async function bootstrap() {
  const app           = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT          = configService.get<string>('PORT') || 8080;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist            : true,    // 엔티티 데코레이터에 없는 프로퍼티 값 제외
      forbidNonWhitelisted : true,    // 엔티티 데코레이터에 없는 값에 대한 에러메세지
      transform            : true     // 컨트롤러가 값을 받을 때 정의한 타입으로 형변환
    })
  )

  app.useGlobalFilters(new HttpExceptionFilter());

  swaggerSetup(app);

  app.enableCors();

  await app.listen(PORT, () => console.log(`🚀🚀🚀 Server Listening on port ${PORT} 🚀🚀🚀`));

  if(module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
