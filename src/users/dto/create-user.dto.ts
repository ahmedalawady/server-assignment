//todo I should have a better way to do this
import { UserType } from '../../types';

export class CreateUserDto {
  username: string;
  password: string;
  user_type: UserType;
}
