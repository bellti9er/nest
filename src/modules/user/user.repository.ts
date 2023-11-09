import { Injectable             } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

import { User           } from "./entity/user.entity";
import { SignUpInputDto } from "../auth/dto/auth.dto";

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findUserByNickname(nickname: string): Promise<User | undefined> {
    return this.findOne({ where: { nickname }});
  }

  async findUserByPhone(phone: string): Promise<User | undefined> {
    return this.findOne({ where: { phone }})
  }

  async createUser(signUpInputDto: SignUpInputDto): Promise<User> {
    const { nickname, phone, birthday, gender } = signUpInputDto;

    const user = this.create();

    user.nickname = nickname;
    user.phone    = phone;
    user.birthday = birthday || null;
    user.gender   = gender   || null;

    return this.save(user);
  }
}
