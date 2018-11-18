import { AlertifyService } from './../_services/Alertify.service';
import { ActivatedRoute } from '@angular/Router';
import { AuthService } from './../_services/auth.service';
import { UserService } from './../_services/user.service';
import { Pagination, PaginatedResult } from './../_models/pagination';
import { User } from './../_models/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  likesParam: string;
  showLoadingProcess: Boolean = false;

  constructor(private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // this.loadUsers();
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    this.likesParam = 'Likers';
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers() {
    this.showLoadingProcess = true;
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, null, this.likesParam)
      .subscribe((res: PaginatedResult<User[]>) => {
      this.users = res.result;
      this.pagination = res.pagination;
      this.showLoadingProcess = false;
    }, error => {
      this.alertify.error(error);
    });
  }

}
