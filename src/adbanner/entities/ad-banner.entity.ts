import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UUID } from 'crypto';
import { AppFile } from '../../file/entity/app-file.entity';
import { Transform } from 'class-transformer';

@Entity()
export class AdBanner {
  @PrimaryGeneratedColumn('uuid')
  id!: UUID;
  @Column('text' , {nullable: true})
  url?: string;
  @OneToOne(() => AppFile, {
    onDelete: 'SET NULL',
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  @Transform((e) => e.value?.id)
  image!: AppFile;
}
