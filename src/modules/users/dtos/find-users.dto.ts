import { Expose, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UsersDto {
  @Transform((value) => value?.obj?._id?.toString(), { toClassOnly: true })
  @Expose()
  @IsOptional()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  nationalId: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  role: string;

  @Expose()
  isBlocked: boolean;
}
