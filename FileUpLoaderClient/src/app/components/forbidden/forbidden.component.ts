import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.css']
})
export class ForbiddenComponent {

  private returnUrl: string ="";

  constructor( private router: Router, private route: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  
  public navigateToLogin = () => {
    this.logOut();
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.returnUrl }});
  }

  logOut = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refreshToken");
    this.router.navigate(['home']);
  }
}
