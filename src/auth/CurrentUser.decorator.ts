import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";

const getUserByExecutionContext = (context: ExecutionContext) => {
  if(context.getType() === 'http') {
    return context.switchToHttp().getRequest().user
  } else if(context.getType<GqlContextType>() === 'graphql') {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req.user
  }
}

export const CurrentUser = createParamDecorator((_data: unknown, executionContext: ExecutionContext) => getUserByExecutionContext(executionContext))