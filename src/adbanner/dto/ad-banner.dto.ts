import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
export class AdBannerDto {
  @IsUrl()
  @IsOptional()
  url?: string;
}
