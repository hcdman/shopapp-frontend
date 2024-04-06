import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { LoginDTO } from '../dtos/user/login.dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  phoneNumber: string =  '0123456789';
  password: string = '1234567';

  constructor(private router: Router, private userService: UserService) {
  }

  onPhoneChange() {
    console.log(`phone typed: ${this.phoneNumber}`);

  }
  login() {
    const loginDTO:LoginDTO = {
      "phone_number": this.phoneNumber,
      "password": this.password,
    };
   this.userService.login(loginDTO).subscribe(
    {
      next: (response: any) => {
        debugger
        //handle response when register success
        //this.router.navigate(['/login']);
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
