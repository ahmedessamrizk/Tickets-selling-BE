import { Module } from '@nestjs/common';
import { EncryptionService } from '../services/encryption.service';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ResponseInterceptor } from '../interceptors/response.interceptor';
import { PaginationService } from '../services/pagination.service';

@Module({
  providers: [
    EncryptionService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    PaginationService,
  ],
  exports: [EncryptionService, PaginationService],
})
export class CommonModule {}
