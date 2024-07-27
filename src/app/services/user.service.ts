import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterDTO } from '../dtos/user/register.dto';
import { LoginDTO } from '../dtos/user/login.dto';
import { environment } from '../environments/environment';
import { UserResponse } from '../responses/user/user.response';
import { UpdateUserDTO } from '../dtos/user/update.user.dto';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiRegister = `${environment.apiBaseUrl}/auth/register`;
  private apiLogin = `${environment.apiBaseUrl}/auth/login`;
  private apiUserDetail = `${environment.apiBaseUrl}/users/details`;
  private apiConfig = {
    headers: this.createHeaders(),

  }
  remember: boolean = true;
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-type': 'application/json',
      'Accept-Language': 'vi'
    });
  }
  register(registerDTO: RegisterDTO): Observable<any> {
    return this.http.post(this.apiRegister, registerDTO, this.apiConfig);
  }
  login(loginDTO: LoginDTO): Observable<any> {
    return this.http.post(this.apiLogin, loginDTO, this.apiConfig);
  }
  loginWithGoogle(authCode: string): Observable<any> 
  {
    return this.http.post(`${environment.apiBaseUrl}/auth/outbound/authentication?code=${authCode}`,this.apiConfig);
  }
  getUserDetail(token: string) {
    return this.http.post(this.apiUserDetail, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }
  saveUserResponse(userResponse?: UserResponse, expiresInMinutes: number = 360, remember: boolean = true) {
    try {
      debugger
      if (userResponse == null || !userResponse) {
        return;
      }
      // Convert the userResponse object to a JSON string
      const userResponseJSON = JSON.stringify(userResponse);
      // Save the JSON string to local storage with a key (e.g., "userResponse")
      this.remember = remember;
      if (remember) {
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + expiresInMinutes);
        this.cookieService.set("user", userResponseJSON, expiryDate);
      }
      else {
        window.sessionStorage.setItem('user', userResponseJSON);
      }
    } catch (error) {
      console.error('Error saving user response:', error);
    }
  }
  updateUserDetail(token: string, updateUserDTO: UpdateUserDTO) {
    debugger
    let userResponse = this.getUserResponse();
    return this.http.put(`${this.apiUserDetail}/${userResponse?.id}`, updateUserDTO, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }
  getUserResponse() {
    try {
      // Retrieve the JSON string from local storage using the key
      let userResponseJSON;
      if (this.remember) {
        userResponseJSON = this.cookieService.get('user');
      }
      else {
        userResponseJSON = window.sessionStorage.getItem("user");
      }

      if (userResponseJSON == null || userResponseJSON == undefined || userResponseJSON.length==0) {
        return null;
      }
      // Parse the JSON string back to an object
      const userResponse = JSON.parse(userResponseJSON!);
      console.log('User response retrieved.');
      return userResponse;
    } catch (error) {
      console.error('Error retrieving user response', error);
      return null; // Return null or handle the error as needed
    }
  }
  removeUserFromCookie(): void {
    try {
      // Remove the user data from local storage using the key
      if (this.remember) {
        this.cookieService.delete('user');
      }
      else {
        window.sessionStorage.removeItem("user");
      }

      console.log('User data removed.');
    } catch (error) {
      console.error('Error removing user data.', error);
      // Handle the error as needed
    }
  }
}