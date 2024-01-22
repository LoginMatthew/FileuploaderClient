import { Injectable, NgZone } from '@angular/core';
import { GlobalComponent } from '../global-component';
import { NotificaitonService } from './notificaiton.service';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';


@Injectable()
export class AutoLougoutService {
  private isLogin : boolean = false;
  private clickTimeMinuteInteval : number = 0;
  private checkTimeSecInterval : number = 0;

  constructor(private router : Router,
    private ngZone: NgZone,
    private authServ : AuthenticationService,
    private notifcationService: NotificaitonService)
  {  
    this.logCheck();
    this.lastClickAction(Date.now());
    this.check();
    this.initClickListener();
    this.initTimerIntervalCheck();
    this.clickTimeMinuteInteval = GlobalComponent.clickTimeMinuteInteval;
    this.checkTimeSecInterval = GlobalComponent.checkTimeSecInterval;
  }
  
  public logCheck()
  {
      this.isLogin=this.isUserLoggedIn();
  }

  //Start event listener
  //Reset idle state when user do any kind of click 
  private initClickListener()
  {
    this.ngZone.runOutsideAngular(() =>
    {
      document.body.addEventListener('click', () => this.resetCLickAction());
    })
  }

  //Time interval to check logout condition every 5 sec
  private initTimerIntervalCheck() 
  {
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        try
        {
          this.check();
        }
        catch (error : any) {
          console.log(error.message)
        }
      }, this.checkTimeSecInterval);
    })
  }

  //Store last click action time
  private lastClickAction(time: any) 
  {
    localStorage.setItem('lastAction', JSON.stringify(time))
  }

  //Store login time
  private storeLoginTime(time: any) 
  {
    localStorage.setItem('loginTime', JSON.stringify(time))
  }

  private getLoginIntervalTime() :number
  {
    return Number(localStorage.getItem('loginIntervalTime'));
  }

  private getLastClickAction() : any
  { 
    return localStorage.getItem('lastAction');
  }

  private getLoginTime() : any
  { 
    return localStorage.getItem('loginTime');
  }

  //reset click time
  private resetCLickAction()
  {
    this.lastClickAction(Date.now());
  }

  private checkTimer(timeInterval : number, storeNumber: any) :boolean
  {
    const now = Date.now();
    const timeEvent = parseInt(storeNumber) + (timeInterval) * 60 * 1000;
    const diff = timeEvent - now;
    return ( diff < 0) && this.isLogin;
  }

  check()
  {
    this.ngZone.run(() => 
    {
      if (this.checkTimer(this.clickTimeMinuteInteval, parseInt(this.getLastClickAction()))) 
      {
        console.log("Logged out by no click event");
        this.logout();
        this.notifcationService.showWarningWithTitle("Your Session Expired due to longer Inactivity, Login Again To Continue", "Warning Idle state!");
        console.log("Your Session Expired due to longer Inactivity, Login Again To Continue");        
      }

      //Autmatically log out when token is Expired!
      if (this.checkTimer(this.getLoginIntervalTime(), parseInt(this.getLoginTime()))) 
      {
        console.log("Logged out since token is epxired!");

        this.notifcationService.showWarningWithTitle("Your Session Expired due to auto login time limit, Login Again To Continue", "Warning login Session Expired!");
        console.log("Your Session Expired due to longer Inactivity, Login Again To Continue");
        this.logout();      
      }      
    });
  }

  private logout()
  {
    this.authServ.logout();
    localStorage.removeItem('lastAction');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('loginIntervalTime');
    this.router.navigate(['/login']);
    this.isLogin = false;
  }

  //check if a user is logged in
  private isUserLoggedIn():boolean
  {
    return this.authServ.isUserAuthenticated();
  }
}
