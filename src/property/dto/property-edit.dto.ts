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

export class PropertyEditDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
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
  size?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  room?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  bathrooms?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
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
  floor?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  isFeature?: boolean;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @Max(2400)
  stocks?: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsOptional()
  lat?: number;
  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsOptional()
  lng?: number;

  @Validate(WithValidator, ['lat', 'lng'])
  combineLatLng?: void;
}

export class PropertyStatusDto {
  @IsEnum(PropertyStatus)
  status!: PropertyStatus;
}
