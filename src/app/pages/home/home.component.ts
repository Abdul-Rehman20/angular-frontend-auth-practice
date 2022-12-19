import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Auth } from 'src/app/classes/auth';
import { AuthService } from 'src/app/service/auth.service';
import jwtDecode from 'jwt-decode';
import { Router } from '@angular/router';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  tiles: Tile[] = [
    { text: 'One', cols: 3, rows: 1, color: 'lightblue' },
    { text: 'Two', cols: 1, rows: 2, color: 'lightgreen' },
    { text: 'Three', cols: 1, rows: 1, color: 'lightpink' },
    { text: 'Four', cols: 2, rows: 1, color: '#DDBDF1' },
  ];
  message = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.jwtUserToken.subscribe((token) => {
      console.log(token);
      if (token) {
        const decoded = jwtDecode(token);
        console.log(decoded);
        console.log(decoded['sub']);
        const url = `${'http://localhost:3333/api/users/'}decoded`;
        this.http
          .get(url, { headers: { Authorization: `Bearer ${token}` } })
          .subscribe({
            next: (user) => {
              console.log(user);
              this.message = `Hi ${user['name']}`;
              this.router.navigate(['']);
            },
            error: (err) => {
              console.log(err);
              this.router.navigate(['register']);
            },
          });
      }
    });
    // this.http.get('http://localhost:8000/auth/user').subscribe(
    //   (user: any) => {
    //     this.message = `Hi ${user.first_name} ${user.last_name}`;
    //     Auth.authEmitter.emit(true);
    //   },
    //   () => {
    //     this.message = 'You Are Not Logged In';
    //     Auth.authEmitter.emit(false);
    //   }
    // );
  }
}
