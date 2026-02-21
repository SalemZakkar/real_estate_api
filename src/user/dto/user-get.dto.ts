import { BasePaginationDto, StringFilterDto, OXorValidator } from 'core';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRoleType } from '../entities/user-role.type';

export class UserGetDto extends BasePaginationDto {
  @ValidateNested()
  @IsOptional()
  @Type(() => StringFilterDto)
  nameOpts?: StringFilterDto;

  @IsOptional()
  @IsString()
  name?: string;
  
  @IsEnum(UserRoleType)
  @IsOptional()
  role?: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @Validate(OXorValidator, ['name', 'nameOpts'])
  closeName?: any;
}
