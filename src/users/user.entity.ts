import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../roles/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'password_needs_reset', default: false })
  passwordNeedsReset: boolean;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinTable()
  role: Role;
}
