import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import {
  BehaviorSubject,
  Observable,
  catchError,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponseDto } from '../model/auth/auth-response-dto';
import { AuthTokenDto } from '../model/auth/auth-token-dto';
import { IUserDto } from '../model/user/user-dto';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<IUserDto | undefined>(undefined);
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
          this.isLoggedIn.next(true);
          this.userSubject.next(response.userDTO);
          this.storeTokens(response.authTokenDTO);
        })
      );
  }

  public getUser(): Observable<IUserDto | null> {
    if (this.userSubject.value && !this.isTokenExpired()) {
      return of(this.userSubject.value);
    } else {
      return this.getUserData().pipe(
        tap((userData) => {
          this.userSubject.next(userData);
        }),
        catchError(() => {
          return this.refreshToken().pipe(
            switchMap(() => this.getUser()),
            catchError(() => {
              this.logout();
              return of(null);
            })
          );
        })
      );
    }
  }

  public getUserData(): Observable<IUserDto> {
    const accessToken = localStorage.getItem('accessToken');
    return this.http.get<IUserDto>(`${this._apiUrl}public/account`, {
      headers: { auth: `${accessToken}` },
    });
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
    this.isLoggedIn.next(false);
    this.userSubject.next(undefined);
    this.router.navigate(['/login']);
  }

  private storeTokens(tokens: AuthTokenDto) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  private refreshToken(): Observable<AuthResponseDto> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http
      .post<AuthResponseDto>(`${this._apiUrl}auth/refreshToken`, {
        refreshToken: refreshToken,
      })
      .pipe(
        tap((response) => {
          this.storeTokens(response.authTokenDTO);
        })
      );
  }
}
