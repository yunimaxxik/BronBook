import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export type UserRole = 'client' | 'admin' | 'manager';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ type: 'varchar', default: 'client' })
  role: UserRole;
}
