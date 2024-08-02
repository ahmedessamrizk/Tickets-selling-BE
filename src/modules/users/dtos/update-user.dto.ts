import { IsNumberString, IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto{
    @IsString()
    @IsOptional()
    @Length(3, 20)
    name: string;
  
    @IsNumberString()
    @IsOptional()
    @Length(11, 11)
    phoneNumber: string;
}