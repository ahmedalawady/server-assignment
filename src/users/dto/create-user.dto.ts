//todo I should have a better way to do this
import { UserRole } from '../../common/types';

export class CreateUserDto {
  username: string;
  password: string;
  role: UserRole;
}
