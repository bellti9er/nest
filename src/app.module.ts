import { 
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer              
} from '@nestjs/common';
import { ConfigModule                    } from '@nestjs/config';
import { InjectDataSource, TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule                       } from '@nestjs/jwt';
import { DataSource                      } from 'typeorm';

import { LoggerMiddleware } from './common/middleware/logger.middleware';
import config               from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal    : true,
      envFilePath : '.env',
      load        : [config]
    }),
    TypeOrmModule.forRoot(config().databaseConfig),
    {
      ...JwtModule.register({
        secret      : config().tokenConfig.accessTokenSecretKey,
        signOptions : { expiresIn: config().tokenConfig.accessTokenExpDate }
      }),
      global: true
    },
    ...config().modulesConfig
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
