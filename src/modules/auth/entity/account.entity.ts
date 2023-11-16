import { ApiProperty                                     } from "@nestjs/swagger";
import { Column, Entity, Generated, JoinColumn, OneToOne } from "typeorm";

import { CoreEntity } from "src/common/entity/core.entity";
import { User       } from "src/modules/user/entity/user.entity";
import { Provider   } from "../enum/provider.enum";

@Entity('accounts')
export class Account extends CoreEntity {
  @Column()
  @Generated('uuid')
  @ApiProperty({ description: 'uid' })
  uid: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @Column({ unique: true })
  @ApiProperty({ description: '이메일' })
  email: string;

  @Column({ nullable: true })
  @ApiProperty({
    description : '비밀번호 (알파벳+숫자+특수문자, 8자 이상)',
    example     : 'abcd1234!@',
    nullable    : true
  })
  password: string;

  @Column({ type: 'enum', enum: Provider})
  @ApiProperty({
    description : '회원가입 경로',
    enum        : Provider
  })
  provider: Provider;

  @Column({ unique: true, nullable: true})
  @ApiProperty({
    description : 'OAuth 제공자 고유 ID',
    nullable    : true
  })
  oauthProviderId: string;

  @Column({ nullable: true, default: null })
  @ApiProperty({
    description : '리프레쉬 토큰',
    nullable    : true,
    default     : null
  })
  refreshToken: string;
}
