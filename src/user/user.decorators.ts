import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // If data is provided, return that property from user, else return the whole user object
    return data ? request.user?.[data] : request.user;
  },
);