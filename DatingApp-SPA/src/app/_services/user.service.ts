import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';

const httpOption = { // we use httpOption because we need to pass token so we are making this 
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
};


@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;
constructor(private http: HttpClient) { }

getUsers(): Observable<User[]> {
  // we want users so using type observable with User model
  // we are returning array that's why using User model with array
  return this.http.get<User[]>(this.baseUrl + 'user', httpOption);
}
getUser(id): Observable<User> {
  return this.http.get<User>(this.baseUrl + 'user/' + id, httpOption);
}

}
