import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class AboutUsDto {
  @IsOptional()
  @IsString()
  @IsUrl({ require_protocol: true }, { message: 'Invalid Instagram URL' })
  instagramLink?: string;

  @IsString()
  @IsUrl({ require_protocol: true }, { message: 'Invalid Facebook URL' })
  @IsOptional()
  facebookLink?: string;

  @IsOptional()
  @IsString()
  @IsUrl({ require_protocol: true }, { message: 'Invalid Telegram URL' })
  telegramLink?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  phones?: string[];

  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  @IsOptional()
  termsAndConditions?: string;
  @IsString()
  @IsOptional()
  privacyPolicy?: string;
}
