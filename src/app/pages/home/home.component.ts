import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Router } from '@angular/router';
import { NotFoundError } from 'rxjs';

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
  message;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    console.log(new Date().getTime() / 1000);
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      console.log(decoded);
      console.log(decoded['sub']);
      const id = decoded['sub'];
      const url = `${'http://localhost:3333/api/users/'}id`;
      this.http.get(url).subscribe({
        next: (user) => {
          console.log('User: ', user);
          localStorage.setItem('user', JSON.stringify(user));
          const a = JSON.parse(localStorage.getItem('user'));
          console.log(a['name']);
          this.message = a['name'];
          this.router.navigate(['']);
        },
        error: (err) => {
          console.log(err);
          this.router.navigate(['login']);
        },
      });
    } else {
      throw new NotFoundError('Token not found');
      this.router.navigate(['login']);
    }
  }
}
