import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Property } from './property.entity';
import { UUID } from 'crypto';

@Entity()
@Unique(['user', 'property']) // prevent duplicate favorites
export class PropertySaved {
  @PrimaryGeneratedColumn('uuid')
  id!: UUID;

  @ManyToOne(() => User, (user) => user.saved, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Property, (product) => product.saved, {
    onDelete: 'CASCADE',
  })
  property!: Property;

  @CreateDateColumn()
  createdAt!: Date;
}
