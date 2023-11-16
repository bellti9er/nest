import { 
  Body, 
  Controller, 
  Get, 
  HttpStatus, 
  Logger, 
  Patch, 
  Post, 
  Req, 
  Res, 
  UseGuards, 
  UseInterceptors
} from '@nestjs/common';
import { ApiTags           } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { SwaggerDecorator                              } from 'src/common/decorator/swagger.decorator';
import { ResultFormatInterceptor                       } from 'src/common/interceptor/result-format.interceptor';
import { GetUserId                                     } from 'src/common/decorator/user.decorator';
import { AuthService                                   } from './auth.service';
import { LoginInputDto, LoginOutputDto, SignUpInputDto } from './dto/auth.dto';
import { RefreshTokenInputDto, RefreshTokenOutputDto   } from './dto/refresh-token.dto';
import { OAuthGuardGenerator                           } from './guard/oauth.guard';
import { Provider                                      } from './enum/provider.enum';
import { IOAuthProfile                                 } from './interface/oauth-profile.interface';
import { JwtAuthGuard                                  } from './guard/jwt.guard';

@ApiTags('AUTH')
@Controller('auth')
@UseInterceptors(ResultFormatInterceptor)
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor(
    private readonly authService : AuthService
  ) { }

  @SwaggerDecorator({
    summary     : '로컬 회원가입',
    description : '로컬 회원가입을 통해 새로운 사용자를 등록합니다.',
    outputType  : LoginOutputDto,
    requireAuth : false,
  })
  @Post('signup/local')
  async localSignUp(
    @Body() body: SignUpInputDto
  ): Promise<LoginOutputDto> {
    this.logger.log(`[signUp] info: ${JSON.stringify({ ...body, password: '***' })}`);

    return this.authService.localSignUp(body)
  }

  @SwaggerDecorator({
    summary     : '로컬 로그인',
    description : '로컬에서 사용자 로그인을 처리합니다.',
    outputType  : LoginOutputDto,
    requireAuth : false
  })
  @Post('login/local')
  async localLogin(
    @Body() body: LoginInputDto
  ): Promise<LoginOutputDto> {
    this.logger.log(`[signIn] info: ${JSON.stringify({ ...body, password: '***' })}`);
    
    return this.authService.localLogin(body);
  }

  @SwaggerDecorator({
    summary     : '액세스 토큰 재발급',
    description : '액세스 토큰이 만료된 경우 리프레시 토큰을 통하여 재발급을 받습니다.',
    outputType  : RefreshTokenOutputDto,
    requireAuth : false
  })
  @Post('refresh')
  async refreshAccessToken(
    @Body() body: RefreshTokenInputDto
  ): Promise<RefreshTokenOutputDto> {
    return this.authService.refreshAccessToken(body);
  }

  @SwaggerDecorator({
    summary     : '카카오 로그인',
    description : '카카오 OAuth를 통해 로그인을 처리합니다. 사용자를 카카오 로그인 페이지로 리디렉션합니다.',
    requireAuth : false
  })
  @Get('login/kakao')
  @UseGuards(OAuthGuardGenerator(Provider.KAKAO))
  kakaoLogin(
    @Res() res: Response
  ): void {
    return res.status(HttpStatus.TEMPORARY_REDIRECT).redirect(this.authService.getAuthorizationUrl(Provider.KAKAO))
  }

  @SwaggerDecorator({
    summary     : '카카오 로그인 콜백',
    description : '카카오 OAuth 로그인 프로세스의 콜백 처리를 담당합니다.',
    outputType  : LoginOutputDto,
    requireAuth : false
  })
  @Get('login/kakao/callback')
  @UseGuards(OAuthGuardGenerator(Provider.KAKAO))
  async kakaoCallback(
    @Req() req: Request
  ): Promise<LoginOutputDto> {    
    return this.authService.oauthLogin(req.user as IOAuthProfile)
  }

  @SwaggerDecorator({
    summary     : '로그아웃',
    description : '사용자를 로그아웃 처리합니다.',
    outputType  : Boolean,
    requireAuth : true
  })
  @Patch('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @GetUserId() userId: number
  ): Promise<Boolean> {
    this.logger.log(`[logout] userId: ${userId}}`);

    return this.authService.logout(userId);
  }
}
