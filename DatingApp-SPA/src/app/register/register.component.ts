import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/Alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() valuesFromHome: any; // @Input() is used to pass data component to component, parent use this.For this use [] inside html
  @Output() cancelRegister =  new EventEmitter(); // @Output() conatin emitter evemt, for this use ()  to access value inside html
  model: any = {};
  constructor(private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  register() {
    this.authService.register(this.model).subscribe(() => {
      this.alertify.success('Registration Successfull');
    }, error => {
      this.alertify.error(error);
    });
  }
  cancel() {
    this.cancelRegister.emit(false);
  }
}
