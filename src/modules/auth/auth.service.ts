import { 
  ConflictException, 
  HttpException, 
  HttpStatus, 
  Injectable, 
  Logger, 
  NotFoundException, 
  UnauthorizedException 
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService    } from '@nestjs/jwt';
import { DataSource    } from 'typeorm';

import { CommonService                                   } from 'src/common/common.service';
import { TokenInfoConfig                                 } from 'src/config/config';
import { SignInInputDto, SignInOutputDto, SignUpInputDto } from './dto/auth.dto';
import { RefreshTokenInputDto, RefreshTokenOutputDto     } from './dto/refresh-token.dto';
import { AccountRepository                               } from './account.repository';
import { UserRepository                                  } from '../user/user.repository';
import { Provider                                        } from './enum/account.enum';
import { AUTH_ERROR, AuthError                           } from './error/auth.error';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  private readonly accessTokenSecretKey  : string;
  private readonly accessTokenExpDate    : string;
  private readonly refreshTokenSecretKey : string;
  private readonly refreshTokenExpDate   : string;

  constructor(
    private readonly dataSource        : DataSource,
    private readonly configService     : ConfigService,
    private readonly commonService     : CommonService,
    private readonly jwtService        : JwtService,
    private readonly accountRepository : AccountRepository,
    private readonly userRepository    : UserRepository,
    private readonly authError         : AuthError
  ) {
    const tokenConfig = this.configService.get<TokenInfoConfig>('tokenConfig');

    this.accessTokenSecretKey  = tokenConfig.accessTokenSecretKey;
    this.accessTokenExpDate    = tokenConfig.accessTokenExpDate;
    this.refreshTokenSecretKey = tokenConfig.refreshTokenSecretKey;
    this.refreshTokenExpDate   = tokenConfig.refreshTokenExpDate;
  }

  async signUp(body: SignUpInputDto): Promise<SignInOutputDto> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const [
        duplicatedAccount, 
        duplicatedNickname, 
        duplicatedPhone
      ] = await Promise.all([
        this.accountRepository.findAccountByEmail(body.email),
        this.userRepository.findUserByNickname(body.nickname),
        this.userRepository.findUserByPhone(body.phone)
      ]);

      if(duplicatedAccount)  throw new ConflictException(AUTH_ERROR.ACCOUNT_EMAIL_ALREADY_EXIST);
      if(duplicatedNickname) throw new ConflictException(AUTH_ERROR.ACCOUNT_NICKNAME_ALREADY_EXIST);
      if(duplicatedPhone)    throw new ConflictException(AUTH_ERROR.ACCOUNT_PHONE_ALREADY_EXIST);

      const hashedPassword = await this.commonService.hash(body.password);
      const user           = await this.userRepository.createUser(body);
      const account        = await this.accountRepository.createAccount(user, body.email, hashedPassword, Provider.LOCAL);

      await queryRunner.commitTransaction();

      return this.signIn({ email: body.email, password: body.password })
    } catch(error) {
      this.logger.error(error);

      await queryRunner.rollbackTransaction();

      const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      
      throw new HttpException(this.authError.errorHandler(error.message), statusCode);
    } finally {
      await queryRunner.release();
    }
  }

  async signIn(body: SignInInputDto): Promise<SignInOutputDto> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { email, password } = body;

      const userAccount = await this.accountRepository.findAccountByEmail(email);

      if(!userAccount) throw new UnauthorizedException(AUTH_ERROR.ACCOUNT_NOT_FOUND);

      const isPasswordMatched = await this.commonService.hashCompare(password, userAccount.password);

      if(!isPasswordMatched) throw new UnauthorizedException(AUTH_ERROR.ACCOUNT_PASSWORD_WAS_WRONG);

      const { accessToken, refreshToken } = await this.getTokens({ accountUid: userAccount.uid });

      await this.accountRepository.updateRefreshToken(userAccount.id, refreshToken);

      await queryRunner.commitTransaction();

      return { accessToken, refreshToken };
    } catch(error) {
      this.logger.error(error);

      await queryRunner.rollbackTransaction();

      const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      
      throw new HttpException(this.authError.errorHandler(error.message), statusCode);
    } finally {
      await queryRunner.release();
    }
  }

  async refreshAccessToken(body: RefreshTokenInputDto): Promise<RefreshTokenOutputDto> {
    if(!body.refreshToken) throw new UnauthorizedException(AUTH_ERROR.REFRESH_TOKEN_MISSING);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const secret  = this.refreshTokenSecretKey;
      const decoded = this.jwtService.verify(body.refreshToken, { secret })

      if(!decoded) throw new UnauthorizedException(AUTH_ERROR.REFRESH_TOKEN_VERIFICATION_FAILED);

      const account     = await this.accountRepository.findAccountByUid(decoded.accountUid)
      const payload     = { accountUid : account.uid };
      const accessToken = await this.createAccessToken(payload)

      return { accessToken }
    } catch(error) {
      this.logger.error(error);

      await queryRunner.rollbackTransaction();

      const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      
      throw new HttpException(this.authError.errorHandler(error.message), statusCode);
    } finally {
      await queryRunner.release();
    }
  }

  private async getTokens(payload: Record<string, string>) {
    return {
      accessToken  : await this.createAccessToken(payload),
      refreshToken : await this.createRefreshToken(payload)
    }
  }

  private async createAccessToken(payload: Record<string, string>): Promise<string> {
    return this.jwtService.sign(payload, {
      secret    : this.accessTokenSecretKey,
      expiresIn : this.accessTokenExpDate
    });
  }

  private async createRefreshToken(payload: Record<string, string>): Promise<string> {
    return this.jwtService.sign(payload, {
      secret    : this.refreshTokenSecretKey,
      expiresIn : this.refreshTokenExpDate
    });
  }
}
