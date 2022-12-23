import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NavComponent } from '../nav/nav.component';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private navComponent: NavComponent) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('PayLoad', payload);
      console.log(new Date().getTime() / 1000);
      if (new Date().getTime() / 1000 >= payload.exp) {
        this.navComponent.logout();
        this.router.navigate(['login']);
      }
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request);
  }
}
