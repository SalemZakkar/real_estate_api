import {
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

export class PropertyCreateDto {
  @IsNumber()
  @IsPositive()
  price!: number;

  @IsUUID()
  cityId!: string;

  @IsString()
  @IsNotEmpty()
  neighborhood!: string;

  @IsNumber()
  @IsPositive()
  size!: number;

  @IsInt()
  @Min(0)
  room!: number;

  @IsInt()
  @Min(0)
  bathrooms!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  propertyAge?: number;

  @IsEnum(RealEstatePropertyType)
  propertyType!: RealEstatePropertyType;

  @IsEnum(RealEstateCategory)
  category!: RealEstateCategory;

  @IsEnum(RealEstatePropertyDeedType)
  propertyDeedType!: RealEstatePropertyDeedType;

  @IsInt()
  @Min(0)
  floor!: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  address?: string;
}