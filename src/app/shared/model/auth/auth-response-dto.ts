import { IUserDto } from '../user/user-dto';
import { AuthTokenDto } from './auth-token-dto';

export interface AuthResponseDto {
  authTokenDTO: AuthTokenDto;
  userDTO: IUserDto;
}
