import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TicketStatus } from '../types';

//TODO: It will be good if I use oneToMany relation between ticket and agent

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subject: string;

  @Column()
  description: string;

  @Column({ type: 'int', update: false })
  customer_id: number;

  @Column({ type: 'int', nullable: true })
  agent_id!: number;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.OPEN })
  status: TicketStatus;

  @Column()
  product_id: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
}
