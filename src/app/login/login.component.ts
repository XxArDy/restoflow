import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { AuthService } from 'src/app/shared/data-access/user/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  showPassword: boolean = false;

  private _authService = inject(AuthService);
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _toastr = inject(ToastrService);

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    this._authService
      .login(this.loginForm.value.username, this.loginForm.value.password)
      .pipe(
        catchError((error) => {
          this._toastr.error('Invalid credentials', 'Error');
          throw error;
        })
      )
      .subscribe((res) => {
        this._toastr.success('Sign in success', 'Success');
        this._router.navigate(['dashboard', 'orders']);
      });
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
