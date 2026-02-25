import { ContactUsType } from '../entities/contact-us.enum';
import { IsEnum, IsString } from 'class-validator';
export class ContactUsDto {
  @IsEnum(ContactUsType)
  type!: ContactUsType;
  @IsString()
  value!: string;
}
