import { ApiProperty } from "@nestjs/swagger";
import { 
  IsEmail, 
  IsEnum, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  Matches 
} from "class-validator";

import { Gender } from "src/modules/user/enum/user.enum";

export class SignUpInputDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: '로그인 이메일' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description : '비밀번호 (알파벳+숫자+특수문자, 8자 이상)',
    example     : 'abcd1234!@'
  })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*_+=-])[A-Za-z\d~!@#$%^&*_+=-]{8,}$/,)
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description : '닉네임',
    minLength   : 2,
    maxLength   : 20
  })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description : '전화번호' })
  phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ 
    description : '생년월일',
    example     : 'YYYY-MM-DD',
    nullable    : true,
    default     : null
  })
  birthday: string;

  @IsEnum(Gender)
  @IsOptional()
  @ApiProperty({
    description : '성별',
    enum        : Gender,
    nullable    : true,
    default     : null
  })
  gender: Gender;
}


export class SignInInputDto {
  @IsEmail()
  @ApiProperty({ description: '로그인 이메일', required: true })
  email: string;

  @IsString()
  @ApiProperty({ description: '비밀번호', required: true })
  password: string;
}

export class SignInOutputDto {
  @ApiProperty({ description: '인증 토큰' })
  accessToken: string;

  @IsOptional()
  @ApiProperty({ description: '리프레쉬 토큰' })
  refreshToken?: string;
}
