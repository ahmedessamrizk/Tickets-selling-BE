import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../../modules/users/schema/users.schema';

export type TicketDocument = HydratedDocument<Ticket>;

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ required: true, minlength: 2, unique: true })
  name: string;

  @Prop({ required: true })
  desc: string;

  @Prop({
    required: true,
  })
  ImageURL: string;

  @Prop({ required: true, min: 5 })
  price: number;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true })
  expiry: Date;

  @Prop({ type: Number, default: 0 })
  sold: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;
}

const TicketSchema = SchemaFactory.createForClass(Ticket);

export { TicketSchema };
