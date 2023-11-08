import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { SnakeNamingStrategy  } from "typeorm-naming-strategies";

import { CommonModule } from "src/common/common.module";
import { AuthModule   } from "src/auth/auth.module";
import { UserModule   } from "src/user/user.module";

export const MODULES = [
  CommonModule,
  UserModule,
  AuthModule
];

export const TypeORMConfig: TypeOrmModuleOptions = {
  type           : 'postgres',
  host           : process.env.DB_HOST,
  port           : +process.env.DB_PORT,
  username       : process.env.DB_USERNAME,
  password       : process.env.DB_PASSWORD,
  database       : process.env.DB_DATABASE,
  synchronize    : false,
  logging        : false,
  namingStrategy : new SnakeNamingStrategy(),
  entities       : [__dirname + '/../**/*.entity.{js,ts}'],
}
