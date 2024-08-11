import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ResponseDto } from '../dtos/response.dto';
export declare class ResponseInterceptor<T> implements NestInterceptor<T, ResponseDto<T>> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ResponseDto<T>>;
}
