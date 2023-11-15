import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.userId;
  }
)