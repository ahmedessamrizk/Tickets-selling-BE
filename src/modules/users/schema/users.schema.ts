import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/common/enums/roles.enum';
import { decryptNationalIdHook } from './users.hooks';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id?: string;

  @Prop({ required: true, minlength: 3, maxlength: 20 })
  name: string;

  @Prop({ required: true, unique: true })
  nationalId: string;

  @Prop({ type: String, enum: Role, default: Role.User })
  role: Role;

  @Prop({ default: false })
  isBlocked: boolean;

  // @Prop({ default: false })
  // isConfirmed: boolean

  @Prop({ required: true, length: 11, unique: true })
  phoneNumber: string;

  @Prop({ required: true })
  password: string;
}

const UserSchema = SchemaFactory.createForClass(User);

decryptNationalIdHook(UserSchema);

export { UserSchema };
