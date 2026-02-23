import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  RealEstateCategory,
  RealEstateStatus,
  RealEstatePropertyDeedType,
  RealEstatePropertyType,
} from './property.enum';
import { User } from '../../user/entities/user.entity';
import { AppFile } from '../../file/entity/app-file.entity';
import { Transform } from 'class-transformer';
import { City } from '../../city/entity/city.entity';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('decimal')
  price!: number;

  @ManyToOne(() => City, { nullable: false, onDelete: 'RESTRICT', eager: true })
  @JoinColumn()
  city!: City;

  @ManyToOne(() => AppFile, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  @Transform((e) => e.value?.filter((e) => e != null).map((e) => e.id))
  images?: AppFile[];

  @Column()
  neighborhood!: string;

  @Column('decimal')
  size!: number;

  @Column('int')
  room!: number;

  @Column('int')
  bathrooms!: number;

  @Column('int', { nullable: true })
  propertyAge?: number;

  @Column({
    type: 'enum',
    enum: RealEstatePropertyType,
  })
  propertyType!: RealEstatePropertyType;

  @Column({
    type: 'enum',
    enum: RealEstateCategory,
  })
  category!: RealEstateCategory;

  @Column({
    type: 'enum',
    enum: RealEstatePropertyDeedType,
  })
  propertyDeedType!: RealEstatePropertyDeedType;

  @Column({
    type: 'enum',
    enum: RealEstateStatus,
    default: RealEstateStatus.pending,
  })
  status!: RealEstateStatus;

  @Column({ default: false })
  isFeature!: boolean;

  @Column('int')
  floor!: number;

  @Column('text', { nullable: true })
  rejectReason?: string;

  @Column('text', { nullable: true })
  notes?: string;

  @Column('text', { nullable: true })
  address?: string;

  @ManyToOne(() => User, { eager: true })
  owner!: User;
}
