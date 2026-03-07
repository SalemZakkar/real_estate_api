import { IsOptional, IsSemVer, IsUrl } from 'class-validator';

export class SettingsDto {
  @IsSemVer()
  @IsOptional()
  mobileMinVersion?: string;
  @IsSemVer()
  @IsOptional()
  webMinVersion?: string;

}
