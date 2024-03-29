import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observer} from "rxjs";
import {LoginRequest} from "@model/user-dto";
import {Authentication} from "@model/user-model";
import {AuthenticationService} from "@services/authentication.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formGroup: UntypedFormGroup;
  welcome: boolean;
  private readonly authObserver: Observer<Authentication>;

  constructor(private formBuilder: UntypedFormBuilder,
              private authenticationService: AuthenticationService) {
    this.formGroup = new UntypedFormGroup({});
    this.welcome = false;
    this.authObserver = {
      next: response => {
        this.welcome = true;
        if (response.user.permissionList.no_permission) {
          alert('You do not have any permissions.');
        }
      },
      error: err => alert(err),
      complete: () => {
      }
    }
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      email_input: ['', Validators.email],
      password_input: ['', Validators.required]
    });
  }

  get email(): string {
    return this.formGroup.get('email_input')?.value;
  }

  get password(): string {
    return this.formGroup.get('password_input')?.value;
  }

  get identifier(): string {
    return this.authenticationService.identifier;
  }

  authenticate(): void {
    if(this.formGroup.invalid) {
      alert('Please fill in the fields correctly.');
      return;
    }
    let login: LoginRequest = {
      email: this.email,
      password: this.password
    };

    this.authenticationService.obtainAuthentication(login).subscribe(this.authObserver);
  }

}
