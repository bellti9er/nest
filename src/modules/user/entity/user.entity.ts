import { ApiProperty                         } from "@nestjs/swagger";
import { Column, Entity, Generated, OneToOne } from "typeorm";

import { CoreEntity } from "src/common/entity/core.entity";
import { Account    } from "src/modules/auth/entity/account.entity";
import { Gender     } from "../enum/user.enum";

@Entity('users')
export class User extends CoreEntity {
  // 데이터베이스 이식성 : 데이터 이전시 동일한 식별자 유지
  // 분산 시스템 : 여러 시스템에서 충돌 없이 고유한 값을 유지
  // 보안 : 순서 예측 불가능한 식별자
  @Column()
  @Generated('uuid')
  @ApiProperty({ description: 'uid' })
  uid: string;

  @OneToOne(() => Account, (account) => account.user, { onDelete: 'CASCADE' })
  account: Account;

  @Column({ unique: true })
  @ApiProperty({
    description : '닉네임',
    minLength   : 2,
    maxLength   : 20
  })
  nickname: string;

  @Column({ nullable: true, default: null })
  @ApiProperty({ 
    description : '프로필 이미지',
    nullable    : true,
    default     : null
  })
  profileImage: string;

  @Column({ nullable:true, default: null })
  @ApiProperty({ description: '전화번호' })
  phone: string;

  @Column({ nullable: true, default: null })
  @ApiProperty({ 
    description : '생년월일',
    example     : 'YYYY-MM-DD',
    nullable    : true,
    default     : null
  })
  birthday: string;

  @Column({ type: 'enum', enum: Gender, nullable: true, default: null})
  @ApiProperty({ 
    description : '성별',
    enum        : Gender,
    nullable    : true,
    default     : null
  })
  gender: Gender;
}
