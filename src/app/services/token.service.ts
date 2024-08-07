import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'access_token';
  private jwtHelperService = new JwtHelperService();

  constructor(private cookieService: CookieService) { }

  // Getter
  getToken(): string | null {
    return this.cookieService.get(this.TOKEN_KEY) || null;
  }

  // Setter
  setToken(token: string, expiresInMinutes: number): void {
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + expiresInMinutes);
    this.cookieService.set(this.TOKEN_KEY, token,expiryDate, "/", "localhost", true, "None");
  }

  // Remove token
  removeToken(): void {
    this.cookieService.delete(this.TOKEN_KEY)
  }

  // Get user ID from token
  getUserId(): number {
    const token = this.getToken();
    if (token) {
      let userObject = this.jwtHelperService.decodeToken(token);
      return 'userId' in userObject ? parseInt(userObject['userId']) : 0;
    }
    return 0;
  }

  // Check if token is expired
  isTokenExpired(): boolean { 
    const token = this.getToken();
    if (!token) {
        return false;
    }       
    return this.jwtHelperService.isTokenExpired(token);
  }
}
