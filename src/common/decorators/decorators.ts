import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @function CurrentUser
 * @description Custom decorator to extract the current user from the request.
 * @param {unknown} data - Optional additional data (not used in this implementation).
 * @param {ExecutionContext} ctx - ExecutionContext object provided by NestJS.
 * @returns {any} The user object extracted from the request.
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // Extract the request object from the execution context
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
