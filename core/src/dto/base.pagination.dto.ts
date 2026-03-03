import { Type, Transform } from 'class-transformer';
import { IsInt, Min, IsOptional, Max } from 'class-validator';

export class BasePaginationDto {
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => value ?? 0)
  @IsInt()
  @Min(0)
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => value ?? 10)
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: number;
}
