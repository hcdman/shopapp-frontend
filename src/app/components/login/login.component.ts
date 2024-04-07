import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LoginDTO } from '../../dtos/user/login.dto';
import { LoginResponse } from 'src/app/responses/user/login.response';
import { TokenService } from 'src/app/services/token.service';
import { RoleService } from 'src/app/services/role.service';
import { Role } from 'src/app/models/role';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  phoneNumber: string =  '0123456789';
  password: string = '1234567';
  roles: Role[]=[];
  rememberMe: boolean = true;
  selectedRole: Role|undefined;

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
    const loginDTO:LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRole?.id??1
    };
    debugger
   this.userService.login(loginDTO).subscribe(
    {
      next: (response: LoginResponse) => {
        debugger
        //save token
        const {token}=response;
        if(this.rememberMe)
          {
        this.tokenService.setToken(token);
          }
      
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        debugger
        console.error('Đăng nhập không thành công', error);
      }
    }
   )
  
  }
}
