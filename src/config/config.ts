import { Type                 } from "@nestjs/common";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { SnakeNamingStrategy  } from "typeorm-naming-strategies";

import { CommonModule } from "src/common/common.module";
import { AuthModule   } from "src/modules/auth/auth.module";
import { UserModule   } from "src/modules/user/user.module";

// 애플리케이션 설정을 위한 인터페이스 정의
export interface AppConfig {
  modulesConfig  : Type[];
  databaseConfig : TypeOrmModuleOptions;
  tokenConfig    : TokenInfoConfig;
  oauthConfig    : OAuthConfig;
}

// 토큰 설정을 위한 인터페이스 정의
export interface TokenInfoConfig {
  accessTokenSecretKey  : string;
  accessTokenExpDate    : string;
  refreshTokenSecretKey : string;
  refreshTokenExpDate   : string;
}

// OAuth 설정을 위한 인터페이스 정의
export interface OAuthConfig {
  kakaoClientId     : string;
  kakaoClientSecret : string;
}

// 모듈 설정 함수
export const modulesConfig = (): Type[] => ([
  CommonModule,
  UserModule,
  AuthModule
]);

// 데이터베이스 설정 함수
export const databaseConfig = (): TypeOrmModuleOptions => ({
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
});

// 토큰 설정 함수
export const tokenConfig = (): TokenInfoConfig => ({
  accessTokenSecretKey  : process.env.ACCESS_TOKEN_SECRET_KEY,
  accessTokenExpDate    : process.env.ACCESS_TOKEN_EXPIRE_DATE,
  refreshTokenSecretKey : process.env.REFRESH_TOKEN_SECRET_KEY,
  refreshTokenExpDate   : process.env.REFRESH_TOKEN_EXPIRE_DATE
});

// OAuth 설정 함수
export const oauthConfig = (): OAuthConfig => ({
  kakaoClientId     : process.env.KAKAO_CLIENT_ID,
  kakaoClientSecret : process.env.KAKAO_CLIENT_SECRET
})

// 최종 설정된 객체를 반환하는 함수
const config = (): AppConfig => ({
  modulesConfig  : modulesConfig(),
  databaseConfig : databaseConfig(),
  tokenConfig    : tokenConfig(),
  oauthConfig    : oauthConfig()
})

export default config;
