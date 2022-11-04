import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "../../src/environments/environment";
import { User } from "./auth/user.model";

export interface AuthResponseData {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?:boolean,
}

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  tokenExpirationDate: any;

  constructor(
    private http:HttpClient,
    private router:Router,
    ){}

  signup(email:string, password:string){
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
      {
          email: email,
          password: password,
          returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleError), 
      tap(resData => {
        this.handleAuthentication(
          resData.email, 
          resData.localId, 
          resData.idToken, 
          +resData.expiresIn
        )
      })
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey, 
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleAuthentication(
          resData.email, 
          resData.localId, 
          resData.idToken, 
          +resData.expiresIn
        )
      })
    );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationDate){
      clearTimeout(this.tokenExpirationDate)
    }
    this.tokenExpirationDate = null;
  }

  private handleAuthentication(email: string, userId: string,token: string, expiresIn: number) {
    // here we get current date with new Date(), apply getDate() to get it in ms and then add expiration date from firebase (in s) multiplied by 1000 to get ms. by wrapping all of this with new Date() we convert it to regular date
    const expirationDate = 
    new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      email, 
      userId, 
      token, 
      expirationDate
    );
    this.user.next(user);
    this.autoLogout(expiresIn*1000);
    // write authenticated user into local storage
    localStorage.setItem('userData', JSON.stringify(user))
  }

  autoLogin(){
    // get authenticated user from local storage
    const userData: {
        email: string,
        id: string;
        _token:string;
        _tokenExpirationDate: string;  
      } = JSON.parse(localStorage.getItem('userData'));
    if(!userData) return;
    const loadedUser = new User(
      userData.email, 
      userData.id, 
      userData._token, 
      new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration= new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  
  autoLogout(expirationDuration: number){
    this.tokenExpirationDate = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleError(errorResp:HttpErrorResponse) {
    let errorMsg:any = 'An unknown error occured';
    if (!errorResp.error || !errorResp.error.error) {
      return throwError(errorMsg)
    }
    switch(errorResp.error.error.message){
      case 'EMAIL_EXISTS':
        errorMsg = 'Email already exists!';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMsg = 'Email not registered!';
        break;
      case 'INVALID_PASSWORD':
        errorMsg = 'Password is invalid!';
        break;
      case 'USER_DISABLED':
        errorMsg = 'This user is disabled by administrator';
        break;
    }
    return throwError(errorMsg);
  }

}