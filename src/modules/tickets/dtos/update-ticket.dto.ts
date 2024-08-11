import {
    IsDateString,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    MinLength,
  } from 'class-validator';
  
  export class UpdateTicketDto {
    @IsString()
    @MinLength(2)
    @IsOptional()
    name: string;
  
    @IsString()
    @IsOptional()
    desc: string;
  
    @IsNumber()
    @Min(5)
    @IsOptional()
    price: number;
  
    @IsNumber()
    @Min(1)
    @IsOptional()
    quantity: number;
  
    @IsDateString()
    @IsOptional()
    expiry: Date;
  }
  