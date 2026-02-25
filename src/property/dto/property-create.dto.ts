import {
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
} from 'class-validator';
import { Type } from 'class-transformer';

import {
  PropertyCategory,
  PropertyDeedType,
  PropertyType,
} from '../entites/property.enum';
import { UUID } from 'crypto';

export class PropertyCreateDto {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price!: number;

  @IsUUID()
  cityId!: UUID;

  @IsString()
  @IsNotEmpty()
  neighborhood!: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  size!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  room!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  bathrooms!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  propertyAge?: number;

  @IsEnum(PropertyType)
  propertyType!: PropertyType;

  @IsEnum(PropertyCategory)
  category!: PropertyCategory;

  @IsEnum(PropertyDeedType)
  propertyDeedType!: PropertyDeedType;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  floor!: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(2400)
  stocks?: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  lat!: number;
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng!: number;
}
