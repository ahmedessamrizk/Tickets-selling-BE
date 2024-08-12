import { Expose, Transform } from 'class-transformer';

export class DiscountTicketDto {
  @Transform((value) => value.obj._id.toString(), { toClassOnly: true })
  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  desc: string;

  @Expose()
  limit: number;

  @Expose()
  expiry: string;

  @Expose()
  ticket: string;
}
