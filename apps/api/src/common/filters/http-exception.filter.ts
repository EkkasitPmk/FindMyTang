import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

interface ExceptionDetails {
  status: number;
  message: string | object;
  errorName: string;
  code: string;
  field?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const details = this.getExceptionDetails(exception);

    response.status(details.status).json({
      statusCode: details.status,
      error: details.errorName,
      code: details.code,
      ...(details.field ? { field: details.field } : {}),
      message: details.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getExceptionDetails(exception: unknown): ExceptionDetails {
    if (exception instanceof HttpException) {
      return this.getHttpExceptionDetails(exception);
    }

    if (exception instanceof Error) {
      this.logger.error(
        `Unhandled Exception: ${exception.message}`,
        exception.stack,
      );
      // ponytail: Mask 500 error internal stack trace details in production to prevent security leaks
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message:
          process.env.NODE_ENV === "production"
            ? "An unexpected error occurred. Please try again later."
            : exception.message,
        errorName: "InternalServerError",
        code: "INTERNAL_SERVER_ERROR",
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
      errorName: "InternalServerError",
      code: "INTERNAL_SERVER_ERROR",
    };
  }

  private getHttpExceptionDetails(exception: HttpException): ExceptionDetails {
    const status = exception.getStatus();
    const response = exception.getResponse();

    if (typeof response === "string") {
      return {
        status,
        message: response,
        errorName: exception.name,
        code: `HTTP_${status}`,
      };
    }

    if (typeof response === "object" && response !== null) {
      return this.getObjectExceptionDetails(exception, status, response);
    }

    return {
      status,
      message: "Internal server error",
      errorName: "InternalServerError",
      code: "INTERNAL_SERVER_ERROR",
    };
  }

  private getObjectExceptionDetails(
    exception: HttpException,
    status: number,
    response: object,
  ): ExceptionDetails {
    const errObj = response as Record<string, unknown>;
    let code = `HTTP_${status}`;

    if (typeof errObj.code === "string") {
      code = errObj.code;
    } else if (status === 400) {
      code = "VALIDATION_ERROR";
    }

    return {
      status,
      message: errObj.message ?? response,
      errorName:
        typeof errObj.error === "string" ? errObj.error : exception.name,
      code,
      field: typeof errObj.field === "string" ? errObj.field : undefined,
    };
  }
}
