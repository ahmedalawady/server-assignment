import { IsString, IsNotEmpty } from 'class-validator';
//TODO I HAVE TO VALIDATE IF THE ORDER IS EXIST OR NOT AND IS BELONG TO THE CUSTOMER
export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  order_number: string;

  @IsString()
  @IsNotEmpty()
  return_reason: string;
}
