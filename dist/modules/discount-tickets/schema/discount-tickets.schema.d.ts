import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Ticket } from '../../../modules/tickets/schema/tickets.schema';
import { User } from '../../../modules/users/schema/users.schema';
export type DiscountTicketDocument = HydratedDocument<DiscountTicket>;
export declare class DiscountTicket {
    name: string;
    desc: string;
    limit: number;
    used: number;
    expiry: Date;
    ticket: Ticket;
    winners: Types.Array<User>;
}
declare const DiscountTicketSchema: MongooseSchema<DiscountTicket, import("mongoose").Model<DiscountTicket, any, any, any, import("mongoose").Document<unknown, any, DiscountTicket> & DiscountTicket & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DiscountTicket, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<DiscountTicket>> & import("mongoose").FlatRecord<DiscountTicket> & {
    _id: Types.ObjectId;
}>;
export { DiscountTicketSchema };
