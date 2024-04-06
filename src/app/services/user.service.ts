import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterDTO } from '../dtos/user/register.dto';
import { LoginDTO } from '../dtos/user/login.dto';
import { evironment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiRegister = `${evironment.apiBaseUrl}/users/register`;
  private apiLogin = `${evironment.apiBaseUrl}/users/login`;
  private apiConfig ={
    headers: this.createHeaders(),
  }
  constructor(private http: HttpClient) { }
  private createHeaders():HttpHeaders
  {
    return new HttpHeaders({ 'Content-type': 'application/json' });
  }
  register(registerDTO: RegisterDTO): Observable<any>
  {
    return this.http.post(this.apiRegister,registerDTO,this.apiConfig);
  }
  login(loginDTO: LoginDTO):Observable<any>
  {
    return this.http.post(this.apiLogin,loginDTO,this.apiConfig);
  }
}
