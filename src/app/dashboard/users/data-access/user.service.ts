import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
}
