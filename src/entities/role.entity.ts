import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'role_name' })
  roleName: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
