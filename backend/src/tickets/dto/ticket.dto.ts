import { TicketStatus } from '../../common/types';

export class TicketDto {
  id: number;
  return_reason: string;
  //Should be customer object
  customer_id: number;
  order_number: string;
  note?: string;
  agent?: {
    id: number;
    name: string;
  };
  status: TicketStatus;
}
