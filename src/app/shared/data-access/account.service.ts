import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, catchError, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponseDto } from '../model/auth/auth-response-dto';
import { AuthTokenDto } from '../model/auth/auth-token-dto';
import { IUserDto } from '../model/user/user-dto';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private _apiUrl: string = environment.apiWarlockUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {}

  public login(email: string, password: string): Observable<AuthResponseDto> {
    return this.http
      .post<AuthResponseDto>(`${this._apiUrl}auth/login`, { email, password })
      .pipe(
        tap((response) => {
          this.storeTokens(response.authTokenDTO);
        })
      );
  }

  public getUserData(): Observable<IUserDto> {
    const accessToken = this.getToken();
    if (this.isTokenExpired()) {
      return this.refreshToken().pipe(
        switchMap(() => this.getUserData()),
        catchError(() => {
          this.logout();
          return throwError('Failed to refresh token');
        })
      );
    } else {
      return this.http.get<IUserDto>(`${this._apiUrl}public/account`, {
        headers: { auth: `${accessToken}` },
      });
    }
  }

  private isTokenExpired(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      const decoded = this.jwtHelper.decodeToken(accessToken);
      return this.jwtHelper.isTokenExpired(accessToken);
    } else {
      return true;
    }
  }

  public getToken() {
    return localStorage.getItem('access_token');
  }

  public logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }

  private storeTokens(tokens: AuthTokenDto) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  private refreshToken(): Observable<AuthTokenDto> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http
      .post<AuthTokenDto>(`${this._apiUrl}auth/refreshToken`, {
        refreshToken: refreshToken,
      })
      .pipe(
        tap((response) => {
          this.storeTokens(response);
        })
      );
  }

  isLoggedIn(): boolean {
    return !this.isTokenExpired();
  }

  getAuthHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
  }
}
