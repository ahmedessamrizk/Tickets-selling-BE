import { IsNotEmpty, IsNumberString, IsString, Length, Matches } from 'class-validator';

export class SigninDto {
  _id?: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  @IsNumberString()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,20}$/, {
    message:
      'Password must be between 5 and 20 characters, contain at least one uppercase letter, one lowercase letter, and one special character @$!%*?&',
  })
  password: string;
}
