import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import { PaymentStatus } from '../../../common/enums/payment.enum';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: { createdAt: 'createdAt' } })
export class Payment {
  @Prop({ type: String, unique: true, required: true })
  transactionId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Ticket', required: true })
  ticket: Types.ObjectId;

  @Prop({ type: Number, required: true })
  deposit: number;

  @Prop({ type: Number, required: true, min: 1 })
  quantity: number;

  @Prop({ type: String, enum: PaymentStatus, required: true })
  status: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

// Customizing the toJSON method to exclude fields
PaymentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false, // removes __v
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.updatedAt;
    delete ret.id;
  },
});
