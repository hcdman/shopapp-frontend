import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router';
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
  dateOfBirth: Date;
  constructor() {
    this.phone = '';
    this.password = '';
    this.retypePassword = '';
    this.fullname = '';
    this.address = '';
    this.isAccepted = false;
    this.dateOfBirth = new Date();
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18);
  }
  onPhoneChange() {
    console.log(`phone typed: ${this.phone}`);

  }
  register() {
    const message = `phone: ${this.phone}  name: ${this.fullname}  password: ${this.password} address: ${this.address}  isaccept: ${this.isAccepted}`
    alert(message);
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
      if (age<18) {
        this.registerForm.form.controls['dateOfBirth'].setErrors({ 'invalidAge': true });
      }
      else {
        this.registerForm.form.controls['dateOfBirth'].setErrors(null);
      }
    }
  }
}
