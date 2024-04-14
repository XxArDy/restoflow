import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { IRole } from 'src/app/shared/model/user/role-dto';
import { IUserDto } from 'src/app/shared/model/user/user-dto';
import { environment } from 'src/environments/environment';
import { ROLES_CONFIG } from './../../configs/app-role';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiWarlockUrl;

  private _http = inject(HttpClient);
  private _authService = inject(AuthService);
  private _toastr = inject(ToastrService);

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

  async createUser(user: IUserDto): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}auth/register`, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: await this._authService.getAuthHeaderAsync(),
      });

      if (!response.ok) {
        throw new Error('Unknown error occurred');
      }

      this._toastr.success('User successfully created');
      return true;
    } catch (error: Error | any) {
      this._toastr.error(error.message, 'Error');
      return false;
    }
  }

  async updateUser(email: string, user: IUserDto): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}public/account/${email}`, {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: await this._authService.getAuthHeaderAsync(),
      });

      if (!response.ok) {
        throw new Error('Unknown error occurred');
      }

      this._toastr.success('User successfully updated');
      return true;
    } catch (error: Error | any) {
      this._toastr.error(error.message, 'Error');
      return false;
    }
  }

  async deactivateActivateUser(userId: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}public/account/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Unknown error occurred');
      }

      this._toastr.success('User successfully deactivated/activated');
      return true;
    } catch (error: Error | any) {
      this._toastr.error(error.message, 'Error');
      return false;
    }
  }

  getFullName(user: IUserDto): string {
    return `${user.firstName} ${user.lastName}`;
  }
}
