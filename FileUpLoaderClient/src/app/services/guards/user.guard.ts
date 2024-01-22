import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root'
})

export class UserGuard implements CanActivate  {
  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    if(this.authService.isUser())
      return true;
      
    this.router.navigate(['/forbidden'], { queryParams: { returnUrl: state.url }});
    return false;
  }

}