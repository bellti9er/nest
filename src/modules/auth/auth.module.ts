import { Module         } from '@nestjs/common';
import { TypeOrmModule  } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { CommonService       } from 'src/common/common.service';
import { AuthService         } from './auth.service';
import { AuthController      } from './auth.controller';
import { AuthError           } from './error/auth.error';
import { Account             } from './entity/account.entity';
import { User                } from '../user/entity/user.entity';
import { AccountRepository   } from './account.repository';
import { UserRepository      } from '../user/user.repository';
import { KakaoOAuthStrategy  } from './strategy/kakao.strategy';

@Module({
  imports   : [
    PassportModule,
    TypeOrmModule.forFeature([User, Account])
  ],
  providers : [
    CommonService,
    AuthService,
    AccountRepository,
    UserRepository,
    AuthError,
    KakaoOAuthStrategy
  ],
  controllers: [AuthController]
})
export class AuthModule {}
