import { UUID } from 'node:crypto';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Property } from '../../property/entites/property.entity';

@Entity()
export class AppFile {
  @PrimaryGeneratedColumn('uuid')
  id!: UUID;
  @Column('text')
  path!: string;
  @Column('text')
  type!: string;
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
