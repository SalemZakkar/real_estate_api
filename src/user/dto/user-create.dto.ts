import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { UserRoleType } from '../entities/user-role.type';
import { OXorValidator , WithValidator } from 'core';

export class UserCreateDto {
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;
  @IsOptional()
  @IsString()
  name!: string;
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password?: string;
  @IsEnum(UserRoleType)
  @IsOptional()
  role!: string;

  @Validate(WithValidator , ['email' , 'password'])
  withPassword?: any;
  @Validate(OXorValidator, ['email', 'phone'])
  xorEmailPhone?: any;

}
