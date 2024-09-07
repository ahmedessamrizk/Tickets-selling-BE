import { IsOptional, IsString } from 'class-validator';

export class GetTicketsDto {
  @IsString()
  @IsOptional()
  page: number;

  @IsString()
  @IsOptional()
  size: number;

  @IsString()
  @IsOptional()
  sortBy: string;

  @IsString()
  @IsOptional()
  sortOrder: string;
}
