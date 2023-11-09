import { Column, Entity, Generated, JoinColumn, OneToOne, Unique } from "typeorm";
import { ApiProperty                                             } from "@nestjs/swagger";

import { CoreEntity } from "src/common/entity/core.entity";
import { User       } from "src/modules/user/entity/user.entity";
import { Provider   } from "../enum/account.enum";

@Entity('accounts')
@Unique(['email'])
export class Account extends CoreEntity {
  @Column()
  @Generated('uuid')
  @ApiProperty({ description: 'uid' })
  uid: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @Column()
  @ApiProperty({ description: '이메일' })
  email: string;

  @Column()
  @ApiProperty({
    description : '비밀번호 (알파벳+숫자+특수문자, 8자 이상)',
    example     : 'abcd1234!@'
  })
  password: string;

  @Column({ type: 'enum', enum: Provider})
  @ApiProperty({
    description : '회원가입 경로',
    enum        : Provider
  })
  provider: Provider;

  @Column({ nullable: true, default: null })
  @ApiProperty({
    description : '리프레쉬 토큰',
    nullable    : true,
    default     : null
  })
  refreshToken: string;
}
