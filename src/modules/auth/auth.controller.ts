import { Body, Controller, Logger, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags                                         } from '@nestjs/swagger';

import { SwaggerDecorator                                } from 'src/common/decorator/swagger.decorator';
import { ResultFormatInterceptor                         } from 'src/common/interceptor/result-format.interceptor';
import { AuthService                                     } from './auth.service';
import { SignInInputDto, SignInOutputDto, SignUpInputDto } from './dto/auth.dto';

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
    outputType  : SignInOutputDto,
    requireAuth : false,
  })
  @Post('/local/signup')
  async signUp(
    @Body() body: SignUpInputDto
  ): Promise<SignInOutputDto> {
    this.logger.log(`[signUp] info: ${JSON.stringify(body)}`)

    return this.authService.signUp(body)
  }

  @SwaggerDecorator({
    summary     : '로컬 로그인',
    description : '로컬에서 사용자 로그인을 처리합니다.',
    outputType  : SignInOutputDto,
    requireAuth : false
  })
  @Post('/local/signin')
  async signIn(
    @Body() body: SignInInputDto
  ): Promise<SignInOutputDto> {
    this.logger.log(`[signIn] email: ${body.email}`)
    
    return this.authService.signIn(body);
  }
}
