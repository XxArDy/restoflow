import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IRole } from 'src/app/shared/model/user/role-dto';
import { IUserDto } from 'src/app/shared/model/user/user-dto';
import { environment } from 'src/environments/environment';
import { BasicFetchService } from '../helpers/basic-fetch.service';
import { ROLES_CONFIG } from './../../configs/app-role';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiWarlockUrl;

  private _http = inject(HttpClient);
  private _authService = inject(AuthService);
  private _basicFetchService = inject(BasicFetchService);

  getAllUsers(): Observable<IUserDto[]> {
    return this._http.get<IUserDto[]>(`${this.baseUrl}public/account/all`);
  }

  async getUserById(userId: number): Promise<IUserDto> {
    const response = await fetch(`${this.baseUrl}public/account/${userId}`);
    return await response.json();
  }

  getAllRole(): Observable<IRole[]> {
    return this._http.get<IRole[]>(`${this.baseUrl}public/role/all`).pipe(
      map((roles) => {
        if (!this._authService.checkPermission([ROLES_CONFIG.superAdmin]))
          return roles.filter((role) => role.role !== ROLES_CONFIG.superAdmin);

        return roles;
      })
    );
  }

  async createUser(user: IUserDto): Promise<IUserDto | null> {
    return this._basicFetchService.create<IUserDto>(
      user,
      `${this.baseUrl}auth/register`
    );
  }

  async updateUser(email: string, user: IUserDto): Promise<IUserDto | null> {
    return this._basicFetchService.update<IUserDto>(
      user,
      `${this.baseUrl}public/account/${email}`
    );
  }

  async deactivateActivateUser(userId: number): Promise<boolean> {
    return this._basicFetchService.delete(
      `${this.baseUrl}public/account/${userId}`
    );
  }

  getFullName(user: IUserDto | null): string {
    return `${user?.firstName} ${user?.lastName}`;
  }
}
