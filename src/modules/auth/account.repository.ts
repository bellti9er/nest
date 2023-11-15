import { Injectable                           } from "@nestjs/common";
import { DataSource, Repository, UpdateResult } from "typeorm";

import { Account  } from "./entity/account.entity";
import { User     } from "../user/entity/user.entity";
import { Provider } from "./enum/provider.enum";

@Injectable()
export class AccountRepository extends Repository<Account> {
  constructor(dataSource: DataSource) {
    super(Account, dataSource.createEntityManager());
  }

  async findAccountByUid(uid: string): Promise<Account | undefined> {
    return this.findOne({ where: { uid }, relations: ['user'] })
  }

  async findAccountByEmail(email: string): Promise<Account | undefined> {
    return this.findOne({ where: { email }})
  }

  async findAccountByOAuthProviderId(provider: Provider, oauthProviderId: string): Promise<Account | undefined> {
    return this.findOne({ where: { provider, oauthProviderId } })
  }

  async findAccountByUserId(userId: number): Promise<Account | undefined> {
    return this.findOne({ where: { user: { id: userId } } })
  }

  async createAccount(
    user             : User, 
    email            : string, 
    provider         : Provider,
    oauthProviderId? : string,
    password?        : string, 
  ): Promise<Account> {
    const account = this.create();

    account.user            = user;
    account.email           = email;
    account.provider        = provider;
    account.oauthProviderId = oauthProviderId || null;
    account.password        = password || null;

    return this.save(account);
  }

  async updateRefreshToken(accountId: number, refreshToken: string | null): Promise<UpdateResult> {
    return this.update(accountId, { refreshToken });
  }
}
