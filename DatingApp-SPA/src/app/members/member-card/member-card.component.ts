import { AlertifyService } from './../../_services/Alertify.service';
import { UserService } from './../../_services/user.service';
import { AuthService } from './../../_services/auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../_models/user';


@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
@Input() user: User;
  constructor(private authservice: AuthService,
      private userService: UserService,
      private alertify: AlertifyService) { }

  ngOnInit() {
  }

  sendLike(recipientId: number) {
    this.userService.sendLike(this.authservice.decodedToken.nameid, recipientId)
    .subscribe(data => {
      this.alertify.success('You have liked : ' + this.user.knownAs);
    }, error => {
      this.alertify.error(error);
    });
  }

}
