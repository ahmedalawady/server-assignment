import { TicketStatus } from '../../types';

export class TicketDto {
  subject: string;
  description: string;
  customer_id: number;
  product_id: number;
  ticket_id: number;
  agent?: {
    id: number;
    name: string;
    title: string;
  };
  status: TicketStatus;
}
