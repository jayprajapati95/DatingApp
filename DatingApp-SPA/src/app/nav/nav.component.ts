import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/Alertify.service';
import { Router } from '@angular/Router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {}; // #loginForm="ngForm" is template reference variable

  constructor(protected authService: AuthService, private alertify: AlertifyService,
    private router: Router) { }

  ngOnInit() {
  }
  login() {
    this.authService.login(this.model).subscribe(
      next => {
        this.alertify.success('Logged in successfully');
      },
      error => {
        this.alertify.error(error);
      }, () => {
        // anonymous function: An anonymous function is a function that is not stored in a program file,
        // but is associated with a variable whose data type is function_handle .
        // Anonymous functions can accept inputs and return outputs, just as standard functions do
        this.router.navigate(['/members']); // after login it will redirect to member list page
      }
    );
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logout() {
    localStorage.removeItem('token');
    this.alertify.message('Logged out');
    this.router.navigate(['/home']);
  }

}
