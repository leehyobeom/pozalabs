import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { logger } from "@libs/log/winston";

import { Reflector } from "@nestjs/core";
import { PATH_METADATA } from "@nestjs/common/constants";

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const path = `${this.reflector.get<string>(
      PATH_METADATA,
      context.getHandler()
    )}`;
    return next.handle().pipe(
      catchError((err) =>
        throwError(() => {
          logger.error(`${path}: ${err}`);
          this.exception(err);
        })
      )
    );
  }

  exception(err) {
    if (!err.status && !err.statusCode) {
      throw new HttpException(err.message, 500);
    }

    if (err.response) {
      throw new HttpException(err.response, err.status, {
        cause: new Error(err.message),
      });
    }

    throw new HttpException(err, err.status, { cause: new Error(err.message) });
  }
}
