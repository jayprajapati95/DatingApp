import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {}; // #loginForm="ngForm" is template reference variable

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  login() {
    this.authService.login(this.model).subscribe(
      next => {
        console.log('Logged in successfully');
      },
      error => {
        console.log('Failed to login');
      }
    );
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !!token; // Return true or false valie as we used !!
  }

  logout() {
    localStorage.removeItem('token');
    console.log('Logged out');
  }

}
