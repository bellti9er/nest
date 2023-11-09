import { Injectable                           } from "@nestjs/common";
import { DataSource, Repository, UpdateResult } from "typeorm";

import { Account  } from "./entity/account.entity";
import { User     } from "../user/entity/user.entity";
import { Provider } from "./enum/account.enum";

@Injectable()
export class AccountRepository extends Repository<Account> {
  constructor(dataSource: DataSource) {
    super(Account, dataSource.createEntityManager());
  }

  async findAccountByEmail(email: string): Promise<Account | undefined> {
    return this.findOne({ where: { email }})
  }

  async createAccount(
    user     : User, 
    email    : string, 
    password : string, 
    provider : Provider
  ): Promise<Account> {
    const account = this.create();

    account.user     = user;
    account.email    = email;
    account.password = password;
    account.provider = provider;

    return this.save(account);
  }

  async updateRefreshToken(userId: number, refreshToken: string): Promise<UpdateResult> {
    return this.update(userId, { refreshToken });
  }
}
