import { Router } from '@angular/Router';
import { User } from './../_models/user';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/Alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() valuesFromHome: any; // @Input() is used to pass data component to component, parent use this.For this use [] inside html
  @Output() cancelRegister =  new EventEmitter(); // @Output() conatin emitter evemt, for this use ()  to access value inside html
  // model: any = {}; -- we do not need this because of use reactive form
  user: User;
  registerForm: FormGroup; // using reactive form
  bsConfig: Partial<BsDatepickerConfig>; // this is use to configure datepicker like change colour etc... 
  // We make partial because we can make all fields options from datepicker

  // #registerForm="ngForm"-- we now do not need this at html side because we using reactive form,
  // [(ngModel)]="model.username" required -- we do not need this two way binding property also
  constructor(private authService: AuthService,
      private router: Router,
      private alertify: AlertifyService,
      private fb: FormBuilder) { }

  ngOnInit() {
   /* We are using formbuilder that why we commented this block 
     this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('',
          [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      confirmPassword: new FormControl('', Validators.required)
  }, this.passwordMatch); */
    this.bsConfig = {
    containerClass: 'theme-red'
    },
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {Validators: this.passwordMatch});
  }

  passwordMatch(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : {'mismatch': true} ;
  }

  register() {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value); // value comming form html, this a javascript object so use this
      this.authService.register(this.user).subscribe(() => {
        this.alertify.success('Registration Successfull');
      }, error => {
        this.alertify.error(error);
      }, () => {
        this.authService.login(this.user).subscribe(() => {
          this.router.navigate(['/members']);
        });
      });
    }
  }
  cancel() {
    this.cancelRegister.emit(false);
  }
}
