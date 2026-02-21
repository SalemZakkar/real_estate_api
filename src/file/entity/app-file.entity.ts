import { UUID } from 'node:crypto';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class AppFile {
  @PrimaryGeneratedColumn('uuid')
  id!: UUID;
  @Column()
  path!: string;
  @Column()
  type!: string;
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
