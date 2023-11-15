import { Injectable, Logger } from "@nestjs/common";
import { ConfigService      } from "@nestjs/config";
import { PassportStrategy   } from "@nestjs/passport";
import { Strategy, Profile  } from "passport-kakao";

import { Provider      } from "../enum/provider.enum";
import { AuthService   } from "../auth.service";
import { IOAuthProfile } from "../interface/oauth-profile.interface";

@Injectable()
export class KakaoOAuthStrategy extends PassportStrategy(Strategy, Provider.KAKAO) {
  private readonly logger = new Logger(KakaoOAuthStrategy.name);

  constructor(
    private readonly configService     : ConfigService,
    private readonly authService       : AuthService
  ) {
    super({
      clientID     : configService.get<string>('KAKAO_CLIENT_ID'),
      clientSecret : configService.get<string>('KAKAO_CLIENT_SECRET'),
      callbackURL  : authService.getAuthorizationUrl(Provider.KAKAO)
    })
  }

  async validate(
    accessToken  : string,
    refreshToken : string,
    profile      : Profile,
    done         : Function
  ): Promise<IOAuthProfile> {
    this.logger.log(`[Kakao-OAuth] profile: ${JSON.stringify(profile)}`);

    return {
      provider        : Provider.KAKAO,
      oauthProviderId : profile.id,
      email           : profile._json.kakao_account.email,
      nickname        : profile._json.kakao_account.profile.nickname,
      profileImage    : profile._json.kakao_account.profile.profile_image_url || null
    }
  }
}
