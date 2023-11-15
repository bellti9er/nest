import { 
  ExecutionContext, 
  Injectable, 
  Logger, 
  UnauthorizedException 
} from "@nestjs/common";
import { AuthGuard     } from "@nestjs/passport";
import { JwtService    } from "@nestjs/jwt"; 
import { ConfigService } from "@nestjs/config";

import { AccountRepository } from "../account.repository";
import { AUTH_ERROR, AuthError        } from "../error/auth.error";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly accountRepository : AccountRepository,
    private readonly jwtService        : JwtService,
    private readonly configService     : ConfigService,
    private readonly authError         : AuthError
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request           = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    
    if(!authorization) throw new UnauthorizedException(this.authError.errorHandler(AUTH_ERROR.ACCESS_TOKEN_MISSING));
    
    const [bearer, token] = authorization.split(' ');
    
    if(bearer !== 'Bearer' || !token) throw new UnauthorizedException(AUTH_ERROR.ACCESS_TOKEN_MALFORMED);
    
    const accountUid = await this.validateToken(token);
    const account    = await this.accountRepository.findAccountByUid(accountUid);
    
    if(!account) throw new UnauthorizedException(AUTH_ERROR.ACCOUNT_NOT_FOUND);
    
    request.user = {
      userId    : account.user.id,
      accountId : account.id
    }
    
    return true;
  }

  private async validateToken(token: string): Promise<string> {
    try {
      const secret = this.configService.get<string>('ACCESS_TOKEN_SECRET_KEY');
      const result = this.jwtService.verify(token, { secret })

      return result.accountUid;
    } catch(error) {
      this.logger.error(`Token validation failed: ${error.message}`, error.stack);

      throw new UnauthorizedException(AUTH_ERROR.ACCESS_TOKEN_VERIFICATION_FAILED);
    }
  }
}
