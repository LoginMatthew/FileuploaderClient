import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalComponent } from 'src/app/global-component';
import { AuthenticatedResponse } from 'src/app/interfaces/AuthenticatedResponse.model';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate  {

  constructor(private router:Router,
    private jwtHelper: JwtHelperService,
    private http: HttpClient){}
  
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const token = localStorage.getItem("auth_token") as string;

    if (token && !this.jwtHelper.isTokenExpired(token))
      return true;
    
    const isRefreshSuccess = await this.tryRefreshingTokens(token); 

    if (!isRefreshSuccess) { 
      this.router.navigate(["/login"]); 
    }
    return isRefreshSuccess;
  }

  private async tryRefreshingTokens(token: string): Promise<boolean> {
    const refreshToken: string = localStorage.getItem("auth_refreshToken") as string;

    if (!token || !refreshToken) { 
      return false;
    }
    
    const credentials = JSON.stringify({ accessToken: token, refreshToken: refreshToken });

    let isRefreshSuccess: boolean;

    const refreshRes = await new Promise<AuthenticatedResponse>((resolve, reject) => {
      this.http.post<AuthenticatedResponse>(`${GlobalComponent.appURL}api/auth/refresh`, credentials, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe({
        next: (res: AuthenticatedResponse) => resolve(res),
        error: (_) => { reject; isRefreshSuccess = false;}
      });
    });

    localStorage.setItem("auth_token", refreshRes.token);
    localStorage.setItem("auth_refreshToken", refreshRes.refreshToken);
    isRefreshSuccess = true;
    
    return isRefreshSuccess;
  }
}