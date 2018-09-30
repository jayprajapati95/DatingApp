import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
// this class is use for show error which is coming fromm API(GLOBALLY)
export  class ErrorInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse) { // error coming from API
                    const applicationError = error.headers.get('Application-Error');
                    if (error.status === 401) {
                        return throwError(error.statusText);
                    }
                    if (applicationError) {
                        return throwError(applicationError);
                    }
                    const serverError = error.error;
                    let modelStateError = '';
                    if (serverError && typeof serverError === 'object') {
                        for (const key in serverError) {
                            if (serverError[key]) {
                                modelStateError += serverError[key] + '\n';
                            }

                        }
                    }
                    return throwError(modelStateError || serverError || 'Server Error');
                }
            })
        );
    }
}
export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};
