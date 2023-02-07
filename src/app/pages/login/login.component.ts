import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  registerForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: '',
      password: '',
      signedIn: true,
    });
  }
  submit(): void {
    this.http
      .post(
        'http://localhost:3333/api/auth/signin',
        this.registerForm.getRawValue()
      )
      .subscribe({
        next: (data) => {
          // console.log(data['accessToken']);
          localStorage.setItem('token', data['accessToken']);
          localStorage.setItem('refresh', data['refreshToken']);
          localStorage.setItem('signedIn', data['signedIn']);
          this.router.navigate(['']);
        },
        error: (err) => {
          console.log(err);
          this.router.navigate(['login']);
        },
      });
  }
}
