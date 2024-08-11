import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../../modules/users/schema/users.schema';
export type TicketDocument = HydratedDocument<Ticket>;
export declare class Ticket {
    name: string;
    desc: string;
    price: number;
    quantity: number;
    expiry: Date;
    createdBy: User;
}
declare const TicketSchema: MongooseSchema<Ticket, import("mongoose").Model<Ticket, any, any, any, import("mongoose").Document<unknown, any, Ticket> & Ticket & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Ticket, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Ticket>> & import("mongoose").FlatRecord<Ticket> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export { TicketSchema };
