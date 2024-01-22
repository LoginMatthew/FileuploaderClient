
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticatedResponse } from '../interfaces/AuthenticatedResponse.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  //Send notification if any user loggedin
  public isLoggedIn : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  timeout! : number;
  private isLoginEpxired : boolean = false;

  constructor(private jwtHelper: JwtHelperService, private router :Router) { }

  public logout = () => {
    this.router.navigate(['/login']);
    localStorage.clear();    
    this.isLoggedIn.next(false);
  }

  public storeUserData(response :AuthenticatedResponse, userName : string, time : any)
  {
    localStorage.setItem("auth_token", response.token);
    localStorage.setItem("UserName", userName.toLowerCase());
    localStorage.setItem("auth_refreshToken", response.refreshToken ); 
    localStorage.setItem("role", response.role);      
    localStorage.setItem("id", response.id+"");
    localStorage.setItem('loginIntervalTime', JSON.stringify(response.expireTimeInMinutes));
    localStorage.setItem('loginTime', JSON.stringify(time));
  }

  public isUserAuthenticated  () :boolean
  {
    const token = localStorage.getItem("auth_token");
    
    if(token != null)
    {
      this.isLoginEpxired = true;
      return !this.jwtHelper.isTokenExpired(token);      
    }

    return false;    
  }

  public isAdmin = () : boolean => this.getRole('Administrator');
  public isUser = () : boolean =>  this.getRole('User');
  
  public getLoggedUserName =() : string =>{
    const token = localStorage.getItem("auth_token");
    
    if (token != null)
    {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    }

    return "";
  }

  private getRole (checkRole : string) : boolean
  {
    const token = localStorage.getItem("auth_token");
    if (token != null)
    {
      const decodedToken = this.jwtHelper.decodeToken(token);
      var role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      return (role as string).includes(checkRole);
    }

    return false;
  }
}
