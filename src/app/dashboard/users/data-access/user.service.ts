import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRole } from 'src/app/shared/model/user/role-dto';
import { IUserDto } from 'src/app/shared/model/user/user-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiWarlockUrl;
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<IUserDto[]> {
    return this.http.get<IUserDto[]>(`${this.baseUrl}public/account/all`);
  }

  deactivateActivateUser(userId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}public/account/${userId}`);
  }

  getAllRole(): Observable<IRole[]> {
    return this.http.get<IRole[]>(`${this.baseUrl}public/role/all`);
  }

  createUser(user: IUserDto): Observable<IUserDto> {
    return this.http.post<IUserDto>(`${this.baseUrl}auth/register`, user);
  }

  updateUser(email: string, user: IUserDto): Observable<IUserDto> {
    return this.http.put<IUserDto>(
      `${this.baseUrl}public/account/${email}`,
      user
    );
  }

  getUserById(userId: number): Observable<IUserDto> {
    return this.http.get<IUserDto>(`${this.baseUrl}public/account/${userId}`);
  }
}
