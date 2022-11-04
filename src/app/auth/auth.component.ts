import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthResponseData, AuthService } from '../auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy{
  isLoginMode = true;
  isLoading = false;
  error:string = null;
  @ViewChild(PlaceHolderDirective, {static:false}) alertHost: PlaceHolderDirective;

  private closeSub: Subscription;

  constructor(private authService:AuthService, private router:Router,
  private componentRes:ComponentFactoryResolver){}

  // commented out my solution for button labels
  // isSignupMode = true;
  // primaryButton = 'Sign Up'
  // switchButton = 'Switch to Login'

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    
    // my solution for button labels
    // this.isSignupMode = !this.isSignupMode;
    // if (this.isSignupMode) {
    //   this.primaryButton = 'Sign Up'
    //   this.switchButton = 'Switch to Login'
    // } else {
    //   this.primaryButton = 'Login'
    //   this.switchButton = 'Switch to Sign Up'
    // }
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    let authObs: Observable<AuthResponseData>;
    this.isLoading = true;
    
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
      // commented out what logic used to be here before authObs was introduced
      // this.authService.signup(email, password).subscribe(
      //   reqData => {
      //     console.log(reqData);
      //     this.isLoading = false;
      //   }, errorMsg => {
      //     console.log(errorMsg);
      //     this.error = errorMsg;
      //     this.isLoading = false;
      //   }
      // );
    }
    authObs.subscribe(reqData => {
      console.log(reqData);
      this.isLoading = false;
      this.router.navigate(['/recipes'])
    }, errorMsg => {
      console.log(errorMsg);
      // showErrorAlert here is used to programmatcially add component into dowm
      this.error = errorMsg;
      // this.showErrorAlert(errorMsg);
      this.isLoading = false;
    }
  );
  form.reset();
}

  onHandleError(){
    this.error = null;
  }
  // this is error created programmaticaly
  private showErrorAlert(message:string){
    // creating component factory
    const alertCmpFactory =  this.componentRes.resolveComponentFactory(AlertComponent);
    // getting placeholder where we want to generate a component
    const hostViewContainerRef = this.alertHost.viewContanerRef;
    // clearing the placeholder
    hostViewContainerRef.clear();
    // creating a component in the placeholder
    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    // adding properties to this instance of the component
    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy(){
    if(this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }

}
