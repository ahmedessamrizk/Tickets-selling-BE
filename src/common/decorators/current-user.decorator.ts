import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    //data ==> contain the value passed to the decorator
    //ctx ==> contain the request object
    //we can't make use of the user repository here since we need to deal with dependency injection which
    //is not possible in a param decorator implementation. So we will use interceptor to get the user data
    //then return it to this decorator.
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
