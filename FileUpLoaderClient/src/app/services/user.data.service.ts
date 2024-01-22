import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalComponent } from '../global-component';
import { NotificaitonService } from './notificaiton.service';
import { AuthenticationService } from './authentication.service';
import { EncryptionDecryptionService } from './encryption-decryption.service';

@Injectable()
export class UserDataService {
  private baseApiUrl: string = `${GlobalComponent.appURL}api/User/`;
  private header! : HttpHeaders;

  constructor(private http: HttpClient)
  {
    this.header =new HttpHeaders().append( "Content-Type", "application/json");
  }

  public login(user : any)
  {
    return this.http.post(`${this.baseApiUrl}Login`, JSON.stringify(user),  {headers : this.header});
  }

  public registerUser(registerNewUser: string)
  {
    return this.http.post(`${this.baseApiUrl}Registration`, JSON.stringify(registerNewUser), {headers :  this.header});
  }

  public modifyUserData(user : string)
  {
    this.headerSet();
    return this.http.post(`${this.baseApiUrl}Update`, JSON.stringify(user), {headers :  this.header});
  }

  public deleteUser(deleteUserModel : string)
  {
    this.headerSet();    
    return this.http.request('delete',`${this.baseApiUrl}Delete`, { body: JSON.stringify(deleteUserModel), headers: this.header} );
  }

  public getAllUser(paginationDatRequest : string)
  {
    this.headerSet();    
    return this.http.request('post',`${this.baseApiUrl}GetUsers`, { body: JSON.stringify(paginationDatRequest), headers: this.header} );
  }

  private headerSet ()
  {
    this.header =new HttpHeaders().append( "Content-Type", "application/json").append('Authorization', `Bearer ${localStorage.getItem("auth_token")}`);
  }
}
