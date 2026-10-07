import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import type { User } from '../../users/entities/user.entity.js';
import type { Message } from './message.entity.js';

@Entity('support_requests')
export class SupportRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne('User', { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany('Message', (message: Message) => message.supportRequest, {
    cascade: true,
  })
  messages: Message[];
}
