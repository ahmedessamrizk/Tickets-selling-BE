import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Ticket } from 'src/modules/tickets/schema/tickets.schema';
import { User } from 'src/modules/users/schema/users.schema';

export type DiscountTicketDocument = HydratedDocument<DiscountTicket>;

@Schema({ timestamps: true })
export class DiscountTicket {
  @Prop({ required: true })
  name: string;

  @Prop()
  desc: string;

  @Prop({ default: 1, min: 1 })
  limit: number; // Maximum number of DiscountTickets who can win this ticket

  @Prop({ default: 0 })
  used: number; // Current number of winners

  @Prop({ required: true })
  expiry: Date; // Expiry date for when the ticket is valid for winners

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
    unique: true,
  })
  ticket: Ticket; // One-to-one reference to the associated Ticket

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  winners: Types.Array<User>; // Array of User references who have won this ticket
}

const DiscountTicketSchema = SchemaFactory.createForClass(DiscountTicket);

export { DiscountTicketSchema };
