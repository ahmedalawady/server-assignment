import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TicketStatus } from '../common/types';
import { Agent } from '../agents/agent.entity';
//TODO: It will be good if I use oneToMany relation between ticket and agent

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', update: false })
  customer_id: number;

  @ManyToOne(() => Agent, (agent) => agent.id)
  @JoinColumn({ name: 'agent_id' })
  Agent!: Agent;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.OPEN })
  status: TicketStatus;

  @Column()
  order_number: string;
  //TODO it will be better if we have specific enum for return reasons
  @Column()
  return_reason: string;

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
}
