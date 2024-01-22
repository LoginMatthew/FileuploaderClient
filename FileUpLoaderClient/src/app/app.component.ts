import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { Subscription } from 'rxjs';
import { AutoLougoutService } from './services/auto.logout.service';
import { AuthGuard } from './services/guards/auth.guard';

export let browserRefresh = false;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  subscription!: Subscription;
  public title = 'FileUpLoaderClient';
  public isCollapsed = true;
  private canLogOut :boolean = false;
  isUserLoggedIn!: boolean;
  loggedName : string ='';

  constructor(private authService: AuthenticationService,
    private router: Router, 
    private autoLogOutServ : AutoLougoutService) { }

   ngOnInit(): void {
    this.authService.isLoggedIn
    .subscribe(x => {
      this.loggedName = localStorage.getItem("UserName") + " (" + localStorage.getItem("role") +  ") " + " Log Out";
      this.canLogOut = x;
    });
  }

  isUserAuthenticated  (): boolean 
  {
    let isLoggedIn= this.authService.isUserAuthenticated();
    if(this.canLogOut && !isLoggedIn)
    {
      this.logOut();
    }

    return isLoggedIn;
  }

  logOut = () => {
    this.authService.logout();
    this.loggedName = 'Login';    
    this.autoLogOutServ.logCheck();
  }    
}
