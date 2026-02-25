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
}

export class PropertyMapGetDto {
  @Max(180)
  @Min(-180)
  @IsNumber()
  @Type(() => Number)
  lat!: number;
  @IsNumber()
  @Max(180)
  @Min(-180)
  @Type(() => Number)
  lng!: number;
  @IsNumber()
  @Max(15000)
  @Min(1)
  @Type(() => Number)
  radius!: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isFeature?: boolean;
}
