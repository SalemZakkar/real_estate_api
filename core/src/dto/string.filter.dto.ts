import { IsArray, IsOptional, IsString } from 'class-validator';

export class StringFilterDto {
  @IsString()
  @IsOptional()
  eq?: string;
  @IsString()
  @IsOptional()
  not?: string;
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  in?: number[];
}
