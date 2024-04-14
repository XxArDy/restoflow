import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { IUserDto } from '../../model/user/user-dto';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<IUserDto | null> {
  constructor(private authService: AuthService) {}

  resolve(): IUserDto | null {
    return this.authService.currentUser;
  }
}
