import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Expose, Transform } from 'class-transformer';
import { UserRoleType } from './user-role.type';
import { AppFile } from '../../file/entity/app-file.entity';

@Index(['email'], { unique: true, where: `"email" IS NOT NULL` })
@Index(['phone'], {
  unique: true,
  where: `"phone" IS NOT NULL`,
})
@Check(`("email" IS NULL OR "password" IS NOT NULL)`)
@Check(`NOT ("email" IS NOT NULL AND "phone" IS NOT NULL)`)
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({nullable: true})
  name?: string;
  @Column({ nullable: true })
  email?: string;
  @Column({ nullable: true })
  phone?: string;
  @Column({
    type: 'enum',
    enum: Object.values(UserRoleType),
    default: UserRoleType.User,
  })
  role!: string;

  @OneToOne(() => AppFile, { onDelete: 'SET NULL', eager: true , nullable: true})
  @JoinColumn()
  @Transform((e) => e.value?.id)
  image?: AppFile | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Exclude()
  @Column({nullable: true})
  password?: string;
  @Expose()
  get isCompleted(): boolean {
    return !!this.name;
  }
}
