import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * @method catch
   * @param {HttpException} exception - The caught exception.
   * @param {ArgumentsHost} host - ArgumentsHost object provided by NestJS.
   * @description Method called when an HTTP exception is caught. It formats and
   *              sends a standardized response.
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    // Extract the HTTP response object from the host
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Determine the status code from the exception or default to internal server error
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract the exception response message or default to 'Internal server error'
    const exceptionResponse: any =
      exception instanceof BadRequestException
        ? exception.getResponse()['message']
        : null;
    let message = exception.message ?? 'Internal server error';

    // Set the message based on the exception response if available
    if (exceptionResponse != null) {
      if (Array.isArray(exceptionResponse)) {
        message = exceptionResponse[0];
      } else {
        message = exceptionResponse;
      }
    }

    // Send a standardized JSON response with status code and message
    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
