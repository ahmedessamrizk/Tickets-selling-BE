import { IsOptional, IsString } from 'class-validator';

export class GetDiscountTicketsDto {
  @IsString()
  @IsOptional()
  page: number;

  @IsString()
  @IsOptional()
  size: number;
}
