import { CoreError } from "src/common/error/core.error";

export const AUTH_ERROR = {
  ACCOUNT_EMAIL_ALREADY_EXIST    : 'emailAlreadyExist',
  ACCOUNT_NICKNAME_ALREADY_EXIST : 'nicknameAlreadyExist',
  ACCOUNT_NOT_FOUND              : 'accountNotFound',
  ACCOUNT_PASSWORD_WAS_WRONG     : 'passwordWasWrong',
  ACCOUNT_PHONE_ALREADY_EXIST    : 'phoneAlreadyExist',
  ACCESS_TOKEN_ERROR             : 'accessTokenError',
  REFRESH_TOKEN_EXPIRED          : 'refreshTokenExpired',
  REFRESH_TOKEN_NOT_FOUND        : 'refreshTokenNotFound'
}

export class AuthError extends CoreError {
  constructor() {
    super();

    this.errorHandle = {
      [AUTH_ERROR.ACCOUNT_EMAIL_ALREADY_EXIST]: {
        id      : AUTH_ERROR.ACCOUNT_EMAIL_ALREADY_EXIST,
        message : '중복된 이메일입니다.'
      },
      [AUTH_ERROR.ACCOUNT_NICKNAME_ALREADY_EXIST]: {
        id      : AUTH_ERROR.ACCOUNT_NICKNAME_ALREADY_EXIST,
        message : '중복된 닉네임입니다.'
      },
      [AUTH_ERROR.ACCOUNT_NOT_FOUND]: {
        id      : AUTH_ERROR.ACCOUNT_NOT_FOUND,
        message : '사용자의 계정을 찾을 수 없습니다.'
      },
      [AUTH_ERROR.ACCOUNT_PASSWORD_WAS_WRONG]: {
        id      : AUTH_ERROR.ACCOUNT_PASSWORD_WAS_WRONG,
        message : '비밀번호가 일치하지 않습니다.'
      },
      [AUTH_ERROR.ACCOUNT_PHONE_ALREADY_EXIST]: {
        id      : AUTH_ERROR.ACCOUNT_PHONE_ALREADY_EXIST,
        message : '이미 가입된 핸드폰 번호입니다.'
      },
      [AUTH_ERROR.ACCESS_TOKEN_ERROR]: {
        id      : AUTH_ERROR.ACCESS_TOKEN_ERROR,
        message : '접근 권한이 없습니다.'
      },
      [AUTH_ERROR.REFRESH_TOKEN_EXPIRED]: {
        id      : AUTH_ERROR.REFRESH_TOKEN_EXPIRED,
        message : '리프레쉬 토큰이 만료되었습니다.'
      },
      [AUTH_ERROR.REFRESH_TOKEN_NOT_FOUND]: {
        id      : AUTH_ERROR.REFRESH_TOKEN_NOT_FOUND,
        message : '리프레쉬 토큰이 존재하지 않습니다.'
      }
    }
  }
}
