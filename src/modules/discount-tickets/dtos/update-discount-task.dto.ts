import {
  IsDateString,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateDiscountTaskDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  desc: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  limit: number;

  @IsDateString()
  @IsOptional()
  expiry: string;

  @IsMongoId()
  @IsOptional()
  ticket: string;
}
