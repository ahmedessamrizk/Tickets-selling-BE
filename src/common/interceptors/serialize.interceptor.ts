import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Type,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

export function Serialize<T>(dto: Type<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

interface ClassConstructor {
  new (...args: any[]): {};
}

class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private readonly dto: ClassConstructor) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response = plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
        return response;
      }),
    );
  }
}
