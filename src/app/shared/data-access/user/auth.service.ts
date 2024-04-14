import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponseDto } from '../../model/auth/auth-response-dto';
import { AuthTokenDto } from '../../model/auth/auth-token-dto';
import { RoutingService } from '../helpers/routing.service';
import { IUserDto } from './../../model/user/user-dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _currentUser = signal<IUserDto | null>(null);
  private _apiUrl: string = environment.apiWarlockUrl;
  private _http = inject(HttpClient);
  private _routingService = inject(RoutingService);
  private _jwtHelper = inject(JwtHelperService);

  get currentUser() {
    return this._currentUser();
  }

  public login(email: string, password: string): Observable<AuthResponseDto> {
    return this._http
      .post<AuthResponseDto>(`${this._apiUrl}auth/login`, { email, password })
      .pipe(
        tap((response) => {
          this.storeTokens(response.authTokenDTO);
          this._currentUser.set(response.userDTO);
        })
      );
  }

  public async getUserData(): Promise<IUserDto | null> {
    if (this.getToken() === '' || localStorage.getItem('refreshToken') === null)
      return null;

    let accessToken = this.getToken();
    if (this.isTokenExpired()) {
      try {
        const tokenData = await this.refreshToken();
        accessToken = tokenData.accessToken;
      } catch (error) {
        this.logout();
        return null;
      }
    }

    const response = await fetch(`${this._apiUrl}public/account`, {
      method: 'GET',
      headers: { auth: `${accessToken}` },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    this._currentUser.set(data);

    return data;
  }

  private isTokenExpired(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      return this._jwtHelper.isTokenExpired(accessToken);
    }
    return true;
  }

  public getToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  public logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this._currentUser.set(null);
    this._routingService.toLoginPage();
  }

  private storeTokens(tokens: AuthTokenDto) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  private async refreshToken(): Promise<AuthTokenDto> {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch(`${this._apiUrl}auth/refreshToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const authTokenDto: AuthTokenDto = await response.json();
    this.storeTokens(authTokenDto);
    return authTokenDto;
  }

  public async isLoggedIn(): Promise<boolean> {
    return await !!this._currentUser();
  }

  public getAuthHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
  }

  public async getAuthHeaderAsync(): Promise<Headers> {
    return new Headers({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    });
  }

  public checkPermission(requiredPermissions: string[]): boolean {
    const userPermissions = this._currentUser()?.authorities?.map(
      (permission) => permission.toLowerCase()
    );

    for (let i = 0; i < requiredPermissions.length; i++) {
      if (userPermissions?.includes(requiredPermissions[i].toLowerCase())) {
        return true;
      }
    }

    return false;
  }

  public isItUserRestaurant(id: number | null): boolean {
    if (id === null) return false;
    return this._currentUser()?.restaurantId === id;
  }
}
