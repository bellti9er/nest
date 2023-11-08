import { Type, applyDecorators } from "@nestjs/common";
import { 
  ApiBadRequestResponse, 
  ApiCreatedResponse, 
  ApiForbiddenResponse, 
  ApiInternalServerErrorResponse, 
  ApiNoContentResponse, 
  ApiNotFoundResponse, 
  ApiOkResponse, 
  ApiOperation, 
  ApiUnauthorizedResponse 
} from "@nestjs/swagger";

interface SwaggerOptions {
  summary      : string;
  description? : string;
  outputType?  : Type<unknown> | Function | [Function] | string;
  requireAuth? : boolean;
  error?       : string;
  isArray?     : boolean;
}

export function SwaggerDecorator(options: SwaggerOptions) {
  const decorators = [
    ApiOkResponse({ description: 'OK', type: options.outputType, isArray: options.isArray }),
    ApiCreatedResponse({ description: 'Created', type: options.outputType }),
    ApiNoContentResponse({ description: 'No Content' }),
    ApiBadRequestResponse({ description: 'Bad Request' }),
    ApiNotFoundResponse({ description: 'Not Found' }),
    ApiInternalServerErrorResponse({ description: 'Internal Server Error' }),
    ApiOperation({ summary: options.summary, description: options.description || options.summary }),
  ];

  if (options.requireAuth) {
    decorators.push(ApiUnauthorizedResponse({ description: 'Unauthorized' }));
    decorators.push(ApiForbiddenResponse({ description: 'Forbidden' }));
  }

  return applyDecorators(...decorators)
}
