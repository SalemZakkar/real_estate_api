import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  Point,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  PropertyCategory,
  PropertyStatus,
  PropertyDeedType,
  PropertyType,
} from './property.enum';
import { User } from '../../user/entities/user.entity';
import { AppFile } from '../../file/entity/app-file.entity';
import { Transform } from 'class-transformer';
import { City } from '../../city/entity/city.entity';

@Entity()
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('bigint', { unique: true, generated: 'increment' })
  refNumber!: number;

  @Column('int')
  price!: number;

  @ManyToOne(() => City, { nullable: false, onDelete: 'RESTRICT', eager: true })
  @JoinColumn()
  city!: City;

  @ManyToMany(() => AppFile, { eager: true })
  @JoinTable({
    name: 'property_files',
  })
  @Transform((e) => e.value?.filter((e) => e != null).map((e) => e.id))
  images?: AppFile[];

  @OneToOne(() => AppFile, {
    onDelete: 'SET NULL',
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  @Transform((e) => e.value?.id)
  video?: AppFile | null;

  @OneToOne(() => AppFile, {
    onDelete: 'SET NULL',
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  @Transform((e) => e.value?.id)
  cover!: AppFile | null;

  @Column()
  neighborhood!: string;

  @Column('int')
  size!: number;

  @Column('int')
  room!: number;

  @Column('int')
  bathrooms!: number;

  @Column('int', { nullable: true })
  propertyAge?: number;

  @Column({
    type: 'enum',
    enum: PropertyType,
    enumName: 'property_type_enum',
  })
  propertyType!: PropertyType;

  @Column({
    type: 'enum',
    enum: PropertyCategory,
    enumName: 'property_category_enum',
  })
  category!: PropertyCategory;

  @Column({
    type: 'enum',
    enum: PropertyDeedType,
    enumName: 'property_deed_enum',
  })
  propertyDeedType!: PropertyDeedType;

  @Column({
    type: 'enum',
    enum: PropertyStatus,
    default: PropertyStatus.unCompleted,
    enumName: 'property_status_enum',
  })
  status!: PropertyStatus;

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

  @ManyToOne(() => User, { eager: true, nullable: false })
  @JoinColumn()
  owner!: User;

  @Column('int', { default: 1 })
  stocks!: number;
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  @Index({ spatial: true })
  @Transform((e) => {
    if (e.value?.coordinates?.length == 2) {
      return {
        lat: e.value.coordinates[1],
        lng: e.value.coordinates[0],
      };
    }
    return undefined;
  })
  coordinates!: Point;

  get isEditable() {
    return [PropertyStatus.unCompleted, PropertyStatus.rejected].includes(
      this.status,
    );
  }

  get isCompleted() {
    return this.images?.length;
  }

  // @BeforeInsert()
  // @BeforeUpdate()
  // async check() {
  //   if (
  //     (this.images?.length || 0) >= 1 &&
  //     this.status == PropertyStatus.unCompleted
  //   ) {
  //     this.status = PropertyStatus.pending;
  //   }
  // }
}
