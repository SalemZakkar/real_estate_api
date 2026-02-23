import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import {
  RealEstateCategory,
  RealEstateStatus,
  RealEstatePropertyDeedType,
  RealEstatePropertyType,
} from './../entity/property.enum';
import { UUID } from 'crypto';

export class PropertyEditDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsUUID()
  @IsOptional()
  cityId?: string;

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
  propertyAge?: number;

  @IsEnum(RealEstatePropertyType)
  @IsOptional()
  propertyType?: RealEstatePropertyType;

  @IsEnum(RealEstateCategory)
  @IsOptional()
  category?: RealEstateCategory;

  @IsEnum(RealEstatePropertyDeedType)
  @IsOptional()
  propertyDeedType?: RealEstatePropertyDeedType;

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
  @IsArray()
  @ArrayMaxSize(6)
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  images?: UUID[];
}
