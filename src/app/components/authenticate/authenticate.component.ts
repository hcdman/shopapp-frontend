import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginResponse } from 'src/app/responses/user/login.response';
import { UserResponse } from 'src/app/responses/user/user.response';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.scss']
})
export class AuthenticateComponent {
  userResponse?: UserResponse

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router
  )
  {

  }
  
  ngOnInit() {
    debugger
    const authCodeRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(authCodeRegex);
    if (isMatch) {
      const authCode = isMatch[1];
      this.userService.loginWithGoogle(authCode).subscribe({
        next: (response: LoginResponse) => {
          debugger;
          const { token } = response;
          const expiresInMinutes = 1;
          this.tokenService.setToken(token,expiresInMinutes);
          debugger;
          this.userService.getUserDetail(token).subscribe({
            next: (response: any) => {
              debugger
              this.userResponse = {
                ...response,
                date_of_birth: new Date(response.date_of_birth),
              };
              this.userService.saveUserResponse(this.userResponse,1);
              if (this.userResponse?.role.name == 'admin') {
                this.router.navigate(['/admin']);
              } else if (this.userResponse?.role.name == 'user') {
                this.router.navigate(['/']);
              }
            },
            complete: () => {
              debugger;
            },
            error: (error: any) => {
              debugger;
              alert(error.error.message);
            }
          })
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          alert(error.error.message);
        }
      
      });
      
  }
}
}
