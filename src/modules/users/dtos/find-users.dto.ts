import { Expose, Transform } from 'class-transformer';

export class GetUsersDto {
  @Transform((value) => value.obj._id.toString(), { toClassOnly: true })
  @Expose()
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
