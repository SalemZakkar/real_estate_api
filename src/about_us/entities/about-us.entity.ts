import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class AboutUs {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'text', nullable: true })
  instagramLink?: string | null;

  @Column({ type: 'text', nullable: true })
  facebookLink?: string | null;

  @Column('text', { array: true, default: [] })
  phones!: string[];

  @Column('text', { nullable: true })
  description?: string | null;

  @Column('text', { nullable: true })
  termsAndConditions?: string | null;

  @Column('text', { nullable: true })
  privacyPolicy?: string | null;
}
