import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificaitonService } from 'src/app/services/notificaiton.service';
import { EncryptionDecryptionService } from 'src/app/services/encryption-decryption.service';
import { UserLoginModel } from 'src/app/interfaces/userLoginModel';
import { UserDataService } from 'src/app/services/user.data.service';
import { AutoLougoutService } from 'src/app/services/auto.logout.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit  {

  invalidLogin!: boolean;
  errorMessage: string = '';
  showError!: boolean;
  hidePassword : boolean = true;
  user : UserLoginModel = {UserName:'', Password:''};

  constructor(private router: Router,
    private authServ : AuthenticationService,
    private notifcationService: NotificaitonService,
    private endecryptionService :EncryptionDecryptionService,
    private userDataService: UserDataService,
    private autoLogOutServ : AutoLougoutService) { }

  ngOnInit(): void {}

  login = ( form: NgForm) => {
    if (form.valid) {
      this.userDataService.login(this.endecryptionService.encryptData(this.user))
      .subscribe({

        next: (data: any) => {
          this.authServ.storeUserData(this.endecryptionService.decryptData(data.response),this.user.UserName, Date.now());
        },
        complete: () =>
      {
        this.invalidLogin = false; 
        this.authServ.isLoggedIn.next(true);
        
        this.notifcationService.showInfo("Logged in");
        this.autoLogOutServ.logCheck();
        this.router.navigate(["/home"]);
      },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.errorMessage = this.handleError(err);
          this.showError = true;
          this.notifcationService.showError("Wrong username or password!")
        }
      });
    }
  }

  togglePassword() :void
  {
    this.hidePassword = !this.hidePassword;
  }

  private handleError = (error: HttpErrorResponse) : string => {
    if(error.status === 404) {
      return this.handleNotFound(error);
    }
    else if(error.status === 401) {
      return this.handleUnauthorized(error);
    }
    else{
      return "Unknown error!";
    }
  }

  private handleNotFound = (error: HttpErrorResponse): string => {
    this.router.navigate(['/404']);
    return error.message;
  }

  private handleUnauthorized = (error: HttpErrorResponse) => {
    if(this.router.url === '/login') {
      return 'Authentication failed. Wrong username or password';
    }
    else {
      this.router.navigate(["/"]);
      return error.message;
    }
  }  
}