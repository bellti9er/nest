import { AuthGuard } from "@nestjs/passport";
import { 
  CanActivate, 
  ExecutionContext, 
  NotFoundException, 
  Type, 
  mixin
} from "@nestjs/common";

import { Provider   } from "../enum/provider.enum";
import { AUTH_ERROR } from "../error/auth.error";

export const OAuthGuardGenerator = (provider: Provider): Type<CanActivate> => {
  class OAuthGuard extends AuthGuard(provider) {
    constructor() {
      super();
    }

    canActivate(context: ExecutionContext): boolean {
      const providersWithoutLocal = Object.values(Provider).filter(p => p !== Provider.LOCAL);

      if (!providersWithoutLocal.includes(provider)) throw new NotFoundException(AUTH_ERROR.UNSUPPORTED_OAUTH_PROVIDER);

      return super.canActivate(context) as boolean;
    }
  }

  return mixin(OAuthGuard)
};
