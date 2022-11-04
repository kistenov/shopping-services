import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, take } from "rxjs/operators";
import { AuthService } from "../auth.service";


@Injectable()
export class AuthInterCeptorService implements HttpInterceptor{

  constructor(private authService: AuthService){}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // take(1) here tells rxjs that we want only to take one value from the observable and unsubscribe immediately
    // exhaustMap waits for the  first observable to complete then gets the data from the previous observable and returns new observable and replace first observable with an inner observable
    return this.authService.user.pipe(
      take(1), 
      exhaustMap(user => {
        // if user is not logged in do not attach token (we don't have any)
        if (!user) return next.handle(req);
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token)
        })
        return next.handle(modifiedReq)
      }))
  }
} 