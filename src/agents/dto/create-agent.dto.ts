import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAgentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  //Todo implement unique username
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
