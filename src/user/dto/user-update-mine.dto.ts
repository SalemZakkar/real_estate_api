import { IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { UserRoleType } from '../entities/user-role.type';

export class UserUpdateMineDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;
}

export class UserUpdateDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;
  @IsEnum(UserRoleType)
  @IsOptional()
  type?: string;
}
