import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NavComponent } from '../nav/nav.component';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private navComponent: NavComponent,
    private http: HttpClient
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (localStorage.getItem('token')) {
      if (localStorage.getItem('signedIn') == 'true') {
        const payload = JSON.parse(
          atob(localStorage.getItem('token').split('.')[1])
        );
        console.log('PayLoad', payload);
        console.log(new Date().getTime() / 1000);
        if (new Date().getTime() / 1000 >= payload.exp) {
          localStorage.removeItem('token');
          const url = `${'http://localhost:3333/api/auth/refresh'}`;
          this.http
            .post(
              url,
              {},
              {
                headers: {
                  Authorization: 'Bearer ' + localStorage.getItem('refresh'),
                },
              }
            )
            .subscribe({
              next: (data) => {
                localStorage.removeItem('refresh');
                localStorage.setItem('token', data['accessToken']);
                localStorage.setItem('refresh', data['refreshToken']);
                if (localStorage.getItem('signedIn') == 'true') {
                  this.router.navigate(['']);
                }
              },
              error: (err) => {
                console.log(err);
                this.router.navigate(['login']);
              },
            });
        }
      } else {
        const payload = JSON.parse(
          atob(localStorage.getItem('token').split('.')[1])
        );
        console.log('PayLoad', payload);
        console.log(new Date().getTime() / 1000);
        if (new Date().getTime() / 1000 >= payload.exp) {
          this.navComponent.logout();
          this.router.navigate(['login']);
        }
      }
    }

    return next.handle(request);
  }
}
