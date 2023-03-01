import { UserRole } from '../../common/types';

export class UserDto {
  id: number;
  username: string;
  role: UserRole;
  created_at: Date;
}
