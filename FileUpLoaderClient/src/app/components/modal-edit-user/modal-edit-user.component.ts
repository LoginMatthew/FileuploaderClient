
import { UserModel } from 'src/app/interfaces/user.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalComponent } from 'src/app/global-component';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificaitonService } from 'src/app/services/notificaiton.service';
import { UserDataService } from 'src/app/services/user.data.service';
import { EncryptionDecryptionService } from 'src/app/services/encryption-decryption.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-edit-user',
  templateUrl: './modal-edit-user.component.html',
  styleUrls: ['./modal-edit-user.component.css']
})
export class ModalEditUserComponent implements  OnInit {
  @Input() inputUser : UserModel = { userName:"",   roles:"", id:0, updateDoneByUserID:0, newPassword:""};
  @Output() isUserModifed:EventEmitter<boolean> =new EventEmitter<boolean>(); 
  user: UserModel = {id:0, userName:"", roles:"", updateDoneByUserID:0, newPassword:""};
  apiDbUrl = `${GlobalComponent.appURL}api/Auth/Update`;
  closeResult: string ='';
  isAdmminLoggedIn : boolean = false;
  isAdmin : boolean = false;
  isUser : boolean = false;
  isPasswordEdit: boolean = false;
  hidePassword : boolean = true;
  hidePassword2 : boolean = true;
  password : string = '';
  confirmPassword : string  = '';
  passwordModify: FormGroup;
  isAllowedToEdit : boolean = false;

  error_messages  = 
  {
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

  constructor(private modalService: NgbModal,
    private authServ: AuthenticationService,
    private notifacationService: NotificaitonService,
    private userDataService: UserDataService,
    private endecryptionService :EncryptionDecryptionService,
    public formBuilder: FormBuilder)
    {
      this.passwordModify = this.formBuilder.group(
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

  ngOnInit()
  {  
    this.isAllowedToEdit = this.authServ.isUser() && this.inputUser.roles.includes("Guest") || this.authServ.isAdmin();
    this.user.id = this.inputUser.id;
    this.user.userName = this.inputUser.userName;
    this.user.roles = this.inputUser.roles;
    this.isAdmminLoggedIn = this.authServ.isAdmin();
    this.reset();

    this.passwordModify = this.formBuilder.group(
      {
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

  passwordCheck(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  edit()
  {
    this.user.roles = this.isAdmin ? "User;Administrator" : this.isUser && !this.isAdmin ? "User" : "Guest"
    this.user.newPassword = this.isPasswordEdit ? this.passwordModify.get('password')?.value : "";
    this.user.updateDoneByUserID = Number(localStorage.getItem("id"));
    
    this.userDataService.modifyUserData(this.endecryptionService.encryptData(this.user))
    .subscribe({      
      error: error => {
        console.error('There was an error!', error);
        this.reset();
        this.isUserModifed.emit(false);
        this.notifacationService.showError("Something went wrong during modification!");
      },
      complete: () =>
      {
        this.notifacationService.showSuccess("Modification was successful!");
        this.isUserModifed.emit(true);
      }
    });

    this.modalService.dismissAll();
  }

  open(content : any) {  
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => 
    {
      this.closeResult = `Closed with: ${result}`;
    }, 
    (reason) => 
    {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getDismissReason(reason: any): string {
    this.reset();
    
    if (reason === ModalDismissReasons.ESC) 
    {      
      return 'by pressing ESC';
    }
    else if (reason === ModalDismissReasons.BACKDROP_CLICK)
    {
      return 'by clicking on a backdrop';
    } 
    else 
    {
      return  `with: ${reason}`;
    }
  }

  togglePassword() :void
  {
    this.hidePassword = !this.hidePassword;
  }

  togglePassword2() :void
  {
    this.hidePassword2 = !this.hidePassword2;
  }

  private reset() : void
  {
    this.isUser = this.inputUser.roles.includes("User");
    this.isAdmin = this.inputUser.roles.includes("Administrator");
    this.isPasswordEdit = false;
  }
}
