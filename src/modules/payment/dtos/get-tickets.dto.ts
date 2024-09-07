import { IsOptional, IsString } from 'class-validator';

export class GetPaymentsDto {
  @IsString()
  @IsOptional()
  page: number;

  @IsString()
  @IsOptional()
  size: number;

  @IsString()
  @IsOptional()
  status: string;
}
