import { Request, Response } from "express";
import { 
  ArgumentsHost, 
  Catch, 
  ExceptionFilter, 
  HttpException, 
  HttpStatus, 
  Logger 
} from "@nestjs/common";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx      = host.switchToHttp();
    const request  = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const responsePayload = {
      success    : false,
      statusCode : status,
      timestamp  : new Date().toISOString(),
      path       : request.url,
      message    : this.getErrorMessage(exception)
    };

    if(process.env.STAGE === 'DEV') {
      this.logger.error(`${request.method} ${request.url}`, exception instanceof Error ? exception.stack : 'An unknown error occurred');
    } else {
      this.logger.error(`${request.method} ${request.url} - ${status} - ${exception instanceof Error ? exception.message : exception}`);
    }

    return response.status(status).json(responsePayload);
  }

  private getErrorMessage(exception: unknown): string {
    if(exception instanceof HttpException) {
      const response = exception.getResponse();

      return typeof response === 'string' ? response : (response as any).message;
    }

    return 'Internal Server Error';
  }
}
