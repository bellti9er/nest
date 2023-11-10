import { CoreError } from "src/common/error/core.error";

export const AUTH_ERROR = {
  ACCOUNT_EMAIL_ALREADY_EXIST       : 'emailAlreadyExist',
  ACCOUNT_NICKNAME_ALREADY_EXIST    : 'nicknameAlreadyExist',
  ACCOUNT_NOT_FOUND                 : 'accountNotFound',
  ACCOUNT_PASSWORD_WAS_WRONG        : 'passwordWasWrong',
  ACCOUNT_PHONE_ALREADY_EXIST       : 'phoneAlreadyExist',
  ACCESS_TOKEN_MISSING              : 'accessTokenMissing',
  ACCESS_TOKEN_MALFORMED            : 'accessTokenMalformed',
  ACCESS_TOKEN_EXPIRED              : 'accessTokenExpired',
  ACCESS_TOKEN_VERIFICATION_FAILED  : 'accessTokenVerificationFailed',
  REFRESH_TOKEN_MISSING             : 'refreshTokenMissing',
  REFRESH_TOKEN_MALFORMED           : 'refreshTokenMalformed',
  REFRESH_TOKEN_EXPIRED             : 'refreshTokenExpired',
  REFRESH_TOKEN_VERIFICATION_FAILED : 'refreshTokenVerificationFailed'
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
      [AUTH_ERROR.ACCESS_TOKEN_MISSING]: {
        id      : AUTH_ERROR.ACCESS_TOKEN_MISSING,
        message : '엑세스 토큰이 전송되지 않았습니다.'
      },
      [AUTH_ERROR.ACCESS_TOKEN_MALFORMED]: {
        id      : AUTH_ERROR.ACCESS_TOKEN_MALFORMED,
        message : '엑세스 토큰의 형식이 잘못되었습니다.'
      },
      [AUTH_ERROR.ACCESS_TOKEN_EXPIRED]: {
        id      : AUTH_ERROR.ACCESS_TOKEN_EXPIRED,
        message : '엑세스 토큰이 만료되었습니다.'
      },
      [AUTH_ERROR.ACCESS_TOKEN_VERIFICATION_FAILED]: {
        id      : AUTH_ERROR.ACCESS_TOKEN_VERIFICATION_FAILED,
        message : '엑세스 토큰 검증에 실패하였습니다.'
      },
      [AUTH_ERROR.REFRESH_TOKEN_MISSING]: {
        id      : AUTH_ERROR.REFRESH_TOKEN_MISSING,
        message : '리프레쉬 토큰이 전송되지 않았습니다.'
      },
      [AUTH_ERROR.REFRESH_TOKEN_MALFORMED]: {
        id      : AUTH_ERROR.REFRESH_TOKEN_EXPIRED,
        message : '리프레쉬 토큰의 형식이 잘못되었습니다.'
      },
      [AUTH_ERROR.REFRESH_TOKEN_EXPIRED]: {
        id      : AUTH_ERROR.REFRESH_TOKEN_EXPIRED,
        message : '리프레쉬 토큰이 만료되었습니다.'
      },
      [AUTH_ERROR.REFRESH_TOKEN_VERIFICATION_FAILED]: {
        id      : AUTH_ERROR.REFRESH_TOKEN_VERIFICATION_FAILED,
        message : '리프레쉬 토큰 검증에 실패하였습니다.'
      },
    }
  }
}
