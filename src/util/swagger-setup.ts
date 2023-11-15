import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication               } from "@nestjs/common";

export function swaggerSetup(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Nest API')
    .setDescription('Nest Backend Develop API')
    .setVersion('1.0.0')
    .addBearerAuth({
      type         : 'http',
      scheme       : 'bearer',
      bearerFormat : 'JWT',
    }, 'access-token')
    .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document)
}
