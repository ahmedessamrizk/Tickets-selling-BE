import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { DiscountTicketsModule } from './modules/discount-tickets/discount-tickets.module';
import { PaymentModule } from './modules/payment/payment.module';
import * as path from 'path';
import { APP_PIPE } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
// import { CurrentUserMiddleware } from './common/middleware/current-user.middleware';

@Module({
  imports: [
    //forRoot() method is used to register the ConfigService provider which is responsible for reading from env
    ConfigModule.forRoot({
      envFilePath: path.resolve(
        __dirname,
        `../src/config/.env.${process.env.NODE_ENV}`,
      ),
      //to be accessed by all modules
      isGlobal: true,
    }),

    //connect to the database
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DBURI'),
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    UsersModule,
    TicketsModule,
    DiscountTicketsModule,
    PaymentModule,
  ],
  providers: [
    //for handling validation
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        //ignore unknown fields
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*'); // Apply middleware to all routes
  }
}
