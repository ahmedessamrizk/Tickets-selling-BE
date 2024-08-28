import { IsMongoId, IsNumber, Min } from "class-validator";

export class CreatePaymentDto{
    @IsMongoId()
    ticketId: string;

    @IsNumber()
    @Min(1)
    quantity: number;
}