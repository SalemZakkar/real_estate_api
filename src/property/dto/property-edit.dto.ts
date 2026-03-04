import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
  Validate,
} from 'class-validator';
import {
  PropertyCategory,
  PropertyDeedType,
  PropertyType,
  PropertyStatus,
} from '../entites/property.enum';
import { UUID } from 'crypto';
import { WithValidator } from 'core';
import { Transform, Type } from 'class-transformer';

export class PropertyEditDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @IsUUID()
  @IsOptional()
  cityId?: UUID;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  neighborhood?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  size?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  room?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  bathrooms?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  propertyAge?: number; //

  @IsEnum(PropertyType)
  @IsOptional()
  propertyType?: PropertyType;

  @IsEnum(PropertyCategory)
  @IsOptional()
  category?: PropertyCategory;

  @IsEnum(PropertyDeedType)
  @IsOptional()
  propertyDeedType?: PropertyDeedType;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  floor?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isFeature?: boolean;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @Max(2400)
  @Type(() => Number)
  stocks?: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsOptional()
  @Type(() => Number)
  lat?: number;
  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsOptional()
  @Type(() => Number)
  lng?: number;

  @Validate(WithValidator, ['lat', 'lng'])
  combineLatLng?: void;
}

export class PropertyStatusDto {
  @IsEnum(PropertyStatus)
  status!: PropertyStatus;

  @IsString()
  @IsOptional()
  rejectReason?: string;
}
