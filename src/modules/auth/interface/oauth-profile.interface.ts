import { Provider } from "../enum/provider.enum";

export interface IOAuthProfile {
  readonly provider        : Provider;
  readonly oauthProviderId : string;
  readonly email           : string;
  readonly nickname        : string;
  readonly profileImage?   : string;
}
