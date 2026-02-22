import {
  IsString,
  IsPhoneNumber,
  IsOptional,
  IsPassportNumber,
  isPhoneNumber,
} from 'class-validator';

export class AuthPhoneDto {
  @IsPhoneNumber()
  phoneNumber!: string;
}

export class AuthLoginPhoneDto extends AuthPhoneDto {
  @IsString()
  @IsOptional()
  code?: string;
}