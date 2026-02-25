import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ContactUsType } from './contact-us.enum';
import { UUID } from 'crypto';
@Entity()
export class ContactUs {
  @PrimaryGeneratedColumn('uuid')
  id!: UUID;
  @Column({
    type: 'enum',
    enumName: 'contact_us_type_enum',
    enum: ContactUsType,
  })
  type!: ContactUsType;

  @Column()
  value!: string;
}
