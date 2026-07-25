import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = "Internal server error";
    let errorName = "InternalServerError";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === "string") {
        message = res;
        errorName = exception.name;
      } else if (typeof res === "object" && res !== null) {
        const errObj = res as Record<string, unknown>;
        message = errObj.message ?? res;
        errorName =
          typeof errObj.error === "string" ? errObj.error : exception.name;
      }
    } else if (exception instanceof Error) {
      this.logger.error(
        `Unhandled Exception: ${exception.message}`,
        exception.stack,
      );
      // ponytail: Mask 500 error internal stack trace details in production to prevent security leaks
      message =
        process.env.NODE_ENV === "production"
          ? "An unexpected error occurred. Please try again later."
          : exception.message;
    }

    const responsePayload = {
      statusCode: status,
      error: errorName,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(responsePayload);
  }
}
