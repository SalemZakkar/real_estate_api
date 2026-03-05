import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { BasePaginationDto, PsqlSortType, WithValidator } from 'core';
import {
  PropertyCategory,
  PropertyDeedType,
  PropertyStatus,
  PropertyType,
} from '../entites/property.enum';
import { UUID } from 'crypto';
import { Transform, Type } from 'class-transformer';

export class PropertyGetDto extends BasePaginationDto {
  @IsEnum(PsqlSortType)
  @IsOptional()
  price?: PsqlSortType;

  @IsEnum(PsqlSortType)
  @IsOptional()
  size?: PsqlSortType;

  @IsEnum(PropertyCategory)
  @IsOptional()
  category?: PropertyCategory;

  @IsEnum(PropertyDeedType)
  @IsOptional()
  propertyDeedType?: PropertyDeedType;

  @IsEnum(PropertyType)
  @IsOptional()
  propertyType?: PropertyType;

  @IsUUID()
  @IsOptional()
  city?: UUID;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isFeature?: boolean;

  @IsUUID()
  @IsOptional()
  owner?: UUID;

  @IsEnum(PropertyStatus)
  @IsOptional()
  status?: PropertyStatus;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isSaved?: boolean;
}

export class PropertyMapGetDto {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isFeature?: boolean;
  @IsNumber()
  @Max(180)
  @Min(-180)
  @Type(() => Number)
  north!: number; // max latitude
  @IsNumber()
  @Max(180)
  @Min(-180)
  @Type(() => Number)
  south!: number; // min latitude
  @IsNumber()
  @Max(180)
  @Min(-180)
  @Type(() => Number)
  east!: number; // max longitude
  @IsNumber()
  @Max(180)
  @Min(-180)
  @Type(() => Number)
  west!: number; // min longitude
}
