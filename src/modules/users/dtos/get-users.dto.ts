import {  IsOptional, IsString } from 'class-validator';

export class GetUsersDto {
  @IsString()
  @IsOptional()
  page: number;

  @IsString()
  @IsOptional()
  size: number;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @IsOptional()
  isBlocked: boolean;

  @IsString()
  @IsOptional()
  sortBy: string;

  @IsString()
  @IsOptional()
  sortOrder: string;
}
