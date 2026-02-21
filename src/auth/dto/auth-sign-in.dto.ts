import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { WithValidator, XorValidator } from 'core';

export class AuthSignInDto {
  @IsString()
  @IsEmail()
  email!: string;
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password!: string;
}
