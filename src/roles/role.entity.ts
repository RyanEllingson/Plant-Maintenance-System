import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn({ name: 'role_id', type: 'int' })
  id: number;

  @Column({ name: 'role_Name' })
  roleName: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
