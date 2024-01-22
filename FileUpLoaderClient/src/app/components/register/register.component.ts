
import { Component } from '@angular/core';
import { RegisterNewUser } from 'src/app/interfaces/resgisterUser';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GlobalComponent } from 'src/app/global-component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificaitonService } from 'src/app/services/notificaiton.service';
import { UserDataService } from 'src/app/services/user.data.service';
import { EncryptionDecryptionService } from 'src/app/services/encryption-decryption.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  {
isAdmin : boolean = false;
isUser : boolean = false;
isGuestRegister : boolean = true;
password : string = '';
confirmPassword : string  = '';
userName : string = '';
isAdmminLoggedIn : boolean = false;
isCreatedUser : boolean = false;
errorMessage: string = '';
showError!: boolean;
hidePassword : boolean = true;
hidePassword2 : boolean = true;
registerForm: FormGroup;


error_messages  = { 

  'userName': [
    { type: 'required', message: 'User Name is required!' },
  ],
  'password': [
    { type: 'required', message: 'Password is required.' },
    { type: 'minlength', message: `Password minimum length at least ${GlobalComponent.passwordMininumLength} !` },
    { type: 'maxlength', message: `Password maximum length at least ${GlobalComponent.passwordMaximumLength} !` }
  ],
  'confirmPassword': [
    { type: 'required', message: 'Password is required.' },
    { type: 'minlength', message: `Password minimum length at least ${GlobalComponent.passwordMininumLength} !` },
    { type: 'maxlength', message: `Password maximum length at least ${GlobalComponent.passwordMaximumLength} !` },
  ],
}

constructor(
  private authServ: AuthenticationService,
  private router: Router,
  private notifcationService: NotificaitonService,
  private userDataService: UserDataService,
  public formBuilder: FormBuilder,
  private endecryptionService :EncryptionDecryptionService)
{
  this.isAdmminLoggedIn = this.authServ.isAdmin();
  this.isGuestRegister = localStorage.getItem("UserName") == null || !this.authServ.isUser();
  this.registerForm = this.formBuilder.group(
    {
      userName: ["",Validators.required],
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)

      ])),
      confirmPassword: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)
      ])),
    },
    {
      validator: this.passwordCheck.bind(this)
    }
  );
 }

 ngOnInit() { 
  this.registerForm = this.formBuilder.group(
    {
      userName: ["",Validators.required],
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)

      ])),
      confirmPassword: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)
      ])),
    },
    {
      validator: this.passwordCheck.bind(this)
    }
  );
 }

  private passwordCheck(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  registerNewUser()
  {
    if(this.registerForm.valid)
    {
      this.showError =false;
      this.errorMessage = '';

      let newUser : RegisterNewUser  = 
      {
        userName: this.registerForm.get('userName')?.value, 
        password:this.registerForm.get('password')?.value,

        roles: this.isAdmin ? "User;Administrator" : this.isUser && !this.isAdmin ? "User" : "Guest"
      };
      
      this.userDataService.registerUser(this.endecryptionService.encryptData(newUser))
      .subscribe({
        error: error => {    
          if(error.status ===409) 
          {
            this.showError =true;
            this.errorMessage = error?.error;
          }

          this.notifcationService.showError("Error in creation user!");
        },
        complete :() =>
        {
          this.isCreatedUser = true;
          if(localStorage.getItem("UserName")==null)
          {
            this.router.navigate(['/login']);
          }

          this.resetVaules();
          this.notifcationService.showSuccess("User was created");
        },
      });
    }
  }

  togglePassword() : void
  {
    this.hidePassword = !this.hidePassword;
  }

  togglePassword2() : void
  {
    this.hidePassword2 = !this.hidePassword2;
  }

  private resetVaules() : void 
  {
    this.userName = '';
    this.password = '';
    this.confirmPassword = '';
    this.isAdmin = false;
    this.isUser = false;
    this.hidePassword = true;
    this.hidePassword2 = true;
  }
}
