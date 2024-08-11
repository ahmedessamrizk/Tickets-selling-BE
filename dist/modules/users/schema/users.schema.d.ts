import { HydratedDocument } from 'mongoose';
import { Role } from '../../../common/enums/roles.enum';
export type UserDocument = HydratedDocument<User>;
export declare class User {
    _id?: string;
    name: string;
    nationalId: string;
    role: Role;
    isBlocked: boolean;
    phoneNumber: string;
    password: string;
}
declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, import("mongoose").Document<unknown, any, User> & User & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & Required<{
    _id: string;
}>>;
export { UserSchema };
