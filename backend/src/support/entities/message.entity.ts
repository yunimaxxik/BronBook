import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import type { User } from '../../users/entities/user.entity.js';
import type { SupportRequest } from './support-request.entity.js';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  supportRequestId: number;

  @Column()
  authorId: number;

  @Column({ type: 'text' })
  text: string;

  @CreateDateColumn()
  sentAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date | null;

  @ManyToOne('User', { eager: false })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @ManyToOne('SupportRequest', (sr) => sr.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'supportRequestId' })
  supportRequest: SupportRequest;
}
