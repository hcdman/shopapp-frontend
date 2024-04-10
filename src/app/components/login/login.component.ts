import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LoginDTO } from '../../dtos/user/login.dto';
import { LoginResponse } from 'src/app/responses/user/login.response';
import { TokenService } from 'src/app/services/token.service';
import { RoleService } from 'src/app/services/role.service';
import { Role } from 'src/app/models/role';
import { UserResponse } from 'src/app/responses/user/user.response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  phoneNumber: string =  '33445566';
  password: string = '123456';
  roles: Role[]=[];
  rememberMe: boolean = true;
  selectedRole: Role|undefined;
  userResponse?: UserResponse

  constructor(private router: Router,
     private userService: UserService,
     private tokenService: TokenService,
     private roleService: RoleService
    ) {
  }

  onPhoneChange() {
    console.log(`phone typed: ${this.phoneNumber}`);

  }
  ngOnInit()
  {
    this.roleService.getRole().subscribe(
      {
        next: (roles: Role[])=>
          {
            this.roles = roles;
            this.selectedRole = roles.length>0?roles[0]:undefined;
          },
          error: (error:any)=>
            {
              console.log(`Error getting roles: `,error);
              
            }
      }
    );
  }
  login() {
    const message = `phone: ${this.phoneNumber}` +
      `password: ${this.password}`;
    //alert(message);
    debugger

    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRole?.id ?? 1
    };
    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        debugger;
        const { token } = response;
        if (this.rememberMe) {          
          this.tokenService.setToken(token);
          debugger;
          this.userService.getUserDetail(token).subscribe({
            next: (response: any) => {
              debugger
              this.userResponse = {
                ...response,
                date_of_birth: new Date(response.date_of_birth),
              };    
              this.userService.saveUserResponseToLocalStorage(this.userResponse); 
              this.router.navigate(['/']);                      
            },
            complete: () => {
              debugger;
            },
            error: (error: any) => {
              debugger;
              alert(error.error.message);
            }
          })
        }                        
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
