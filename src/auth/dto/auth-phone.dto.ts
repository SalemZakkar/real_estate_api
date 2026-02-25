import {
  IsString,
  IsPhoneNumber,
  IsUUID,
} from 'class-validator';
import { UUID } from 'crypto';

export class AuthPhoneDto {
  @IsPhoneNumber()
  phoneNumber!: string;
}

export class AuthVerifyLoginDto  {
  @IsString()
  code!: string;

  @IsUUID()
  vid!: UUID;

}