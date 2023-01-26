import { UserType } from '../../types';

export class UserDto {
  id: number;
  username: string;
  user_type: UserType;
  created_at: Date;
}
