import { PaginatedResult } from './../_models/pagination';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { map } from 'rxjs/operators';

// const httpOption = { // we use httpOption because we need to pass token so we are making this
 // headers: new HttpHeaders({
  //  'Authorization': 'Bearer ' + localStorage.getItem('token')
  // })
// };
// Commetn: we use JwtModule to send token automatically so we commented this .


@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getUsers(page?, itemsPerPage?, userParams?, likesParams?): Observable<PaginatedResult<User[]>> {
  // we want users so using type observable with User model
  // we are returning array that's why using User model with array
 // return this.http.get<User[]>(this.baseUrl + 'user', httpOption);

    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    if (likesParams === 'Likers') {
      params = params.append('likers', 'true');
    }

    if (likesParams === 'Likees') {
      params = params.append('Likees', 'true');
    }


    return this.http.get<User[]>(this.baseUrl + 'user', {observe: 'response' , params})
      .pipe(
          map(response => {
            paginatedResult.result = response.body;
            if (response.headers.get('pagination') != null) {
              paginatedResult.pagination = JSON.parse(response.headers.get('pagination'));
            }
            return paginatedResult;
          })
      );
  }
  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'user/' + id);
  }

  updateUser (id: number, user: User) {
    return this.http.put(this.baseUrl + 'user/' + id, user);
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
  }
  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id );
  }
  sendLike(id: number, recipientId: number) {
    return this.http.post(this.baseUrl + 'user/' + id + '/like/' + recipientId, {});
  }

}
