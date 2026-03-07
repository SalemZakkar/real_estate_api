import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class AppSettings {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column('text')
  mobileMinVersion!: string;
  @Column('text')
  webMinVersion!: string;
}
