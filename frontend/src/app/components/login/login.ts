import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authservice: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const logindetails = this.loginForm.value;
      this.authservice.login(logindetails).subscribe({
        next: (resp: any) => {
          if (resp?.token) {
            // localStorage.setItem('token', resp.token);
            this.authservice.saveToken(resp.token);
            this.authservice.saveRole(resp.role);
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          console.log('err', err);
          alert(err.error.message);
        },
      });
    }
  }
}
