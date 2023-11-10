import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsString              } from "class-validator";

import { SignInOutputDto } from "./auth.dto";

export class RefreshTokenInputDto {
  @IsString()
  @ApiProperty({ description: '리프레쉬 토큰', required: true })
  refreshToken: string;
}

export class RefreshTokenOutputDto extends PickType(SignInOutputDto, [
  'accessToken'
]) { }
