import { 
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer              
} from '@nestjs/common';
import { ConfigModule                    } from '@nestjs/config';
import { InjectDataSource, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource                      } from 'typeorm';

import { LoggerMiddleware       } from './common/middleware/logger.middleware';
import { MODULES, TypeORMConfig } from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal    : true,
      envFilePath : '.env'
    }),
    TypeOrmModule.forRoot(TypeORMConfig),
    ...MODULES
  ],
  controllers : [],
  providers   : [],
})
export class AppModule implements NestModule {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource
  ) { }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({
        path   : '*',
        method : RequestMethod.ALL
      });
  }
}
