import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { RegisterDTO } from '../../../dtos/user/register.dto';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  //declare field 
  phone: string;
  password: string;
  retypePassword: string;
  fullname: string;
  address: string;
  isAccepted: boolean;
  showPassword: boolean = false;
  showRetype: boolean = false;
  dateOfBirth: Date;
  constructor(private router: Router, private userService: UserService) {
    this.phone = '';
    this.password = '';
    this.retypePassword = '';
    this.fullname = '';
    this.address = '';
    this.isAccepted = false;
    this.dateOfBirth = new Date();
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18);
    //inject

  }
  onPhoneChange() {
    console.log(`phone typed: ${this.phone}`);

  }
  register() {
    const registerDTO:RegisterDTO = {
      "fullname": this.fullname,
      "phone_number": this.phone,
      "address": this.address,
      "password": this.password,
      "retype_password": this.retypePassword,
      "date_of_birth": this.dateOfBirth,
      "facebook_account_id": 0,
      "google_account_id": 0,
      "role_id": 1
    };
   this.userService.register(registerDTO).subscribe(
    {
      next: (response: any) => {
        debugger
        //handle response when register success
        this.router.navigate(['/login']);
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        alert(error.error)
        debugger
        console.error('Đăng ký thông tin không thành công', error);
      }
    }
   )
  
  }
  checkPasswordMatch() {
    if (this.password !== this.retypePassword) {
      this.registerForm.form.controls['retypePassword'].setErrors({ 'passwordMismatch': true });
    }
    else {
      this.registerForm.form.controls['retypePassword'].setErrors(null);
    }
  }
  chechAge() {
    if (this.dateOfBirth) {
      const today = new Date();
      const birtDate = new Date(this.dateOfBirth);
      let age = today.getFullYear() - birtDate.getFullYear();
      let monthDiff = today.getMonth() - birtDate.getMonth();
      if (monthDiff < 0 || monthDiff == 0 && today.getDay() < birtDate.getDay()) {
        age--;
      }
      if (age < 18) {
        this.registerForm.form.controls['dateOfBirth'].setErrors({ 'invalidAge': true });
      }
      else {
        this.registerForm.form.controls['dateOfBirth'].setErrors(null);
      }
    }
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  toggleRetype() {
    this.showRetype =  !this.showRetype;
  }
}
