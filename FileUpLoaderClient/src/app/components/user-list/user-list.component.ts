import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,  AfterViewInit, ViewChild } from '@angular/core';
import { GlobalComponent } from 'src/app/global-component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserModel } from 'src/app/interfaces/user.model';
import { PaginationUserData } from 'src/app/interfaces/PaginationUserData';
import { NotificaitonService } from 'src/app/services/notificaiton.service';
import { UserDataService } from 'src/app/services/user.data.service';
import { PaginationDataRequest } from 'src/app/interfaces/PaginationFileDataRequest';
import { EncryptionDecryptionService } from 'src/app/services/encryption-decryption.service';
import { DeleteUserModel } from 'src/app/interfaces/deleteUserModel';
import { DataFile } from 'src/app/interfaces/datafile.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent  implements OnInit, AfterViewInit {
  users: UserModel[] = [];
  resultGet!: PaginationUserData;
  selectedType ="";
  userNameSearch : string ="";
  filterName : string="";
  totalCount! : number;
  isAdmin : boolean;
  isUser : boolean;
  isDeleteDisabled : boolean;
  pageEvent!: PageEvent;
  datasource!: null;
  currentPage!:number;
  pageSize!:number;  
  isDescendingOrder! : boolean;
  displayedColumns = ['UserName', 'Roles', 'options'];  
  dataSource: MatTableDataSource<UserModel> = new MatTableDataSource(this.users);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private authServ: AuthenticationService,
    private notifacationService: NotificaitonService,
    private userDataService: UserDataService,
    private notifcationService: NotificaitonService,
    private endecryptionService :EncryptionDecryptionService)
  {    
    this.isDeleteDisabled = true;
    this.isDescendingOrder = false;
    this.isAdmin = authServ.isAdmin();
    this.isUser = authServ.isUser();
  }

  deleteStyle (user : UserModel) :string
  {
    if(this.authServ.isAdmin() && user.userName === localStorage.getItem("UserName"))    
      return  'not-allowed';
     
    return '';
  }

  ngAfterViewInit()
  {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public isDeleteAllowed(dFile : DataFile) : boolean {
    const userName= this.authServ.getLoggedUserName();

    if ((userName != "" && dFile.uploader === userName) || this.authServ.isAdmin())
      return true;

    return false;
  }

  ngOnInit(){
    this.getAllRawData();
  }

  async deleteUser(user: UserModel)
  {
    if(this.authServ.isAdmin() && user.userName === localStorage.getItem("UserName"))   
    {
      this.notifacationService.showError("Cannot delete yourself!");
    }
    else
    {  
      var deleteUserModel : DeleteUserModel = {userId:user.id, deleteDoneByUserID:Number(localStorage.getItem("id"))};
      this.userDataService.deleteUser(this.endecryptionService.encryptData(deleteUserModel))
      .subscribe({
        complete: () => {
          this.UpdateAfterModificaiton(true);
          this.notifacationService.showSuccess("User was deleted successfully!");
        },
        error: (err: HttpErrorResponse) =>
        {
          console.log(err);
          this.notifacationService.showError("Something went wrong during deletion!");
        }
      });
    }
  }

  applyFilter(filterValue: any)
  {
    filterValue = filterValue.target.value.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  UpdateAfterModificaiton(isDeleted: boolean)
  {
    if(isDeleted)
    {
      this.selectedType =="" ?  this.getAllData() : this.getFilterTypeUser(this.selectedType);
    }
    else
    {
      this.notifacationService.showError("Something went wrong!");
    }
  }

  filterFilesDescendingOrder()
  {
    this.isDescendingOrder = true;
    this.ModifyOrder();
  }

  filterFilesAscendingOrder()
  {
    this.isDescendingOrder = false;
    this.ModifyOrder();
  }
  
  getAllData()
  {
    this.getAllRawData();
    this.ResetPaginator();
  }

  getFilterTypeUser (fileType :string) 
  {
    this.ResetPaginator();;    
    this.userNameSearch ="";
    this.selectedType = fileType;
    var paginationRequest : PaginationDataRequest = {page:0, pageSize:10, selectedType:this.selectedType, isDescendingOrder:this.isDescendingOrder, filterNameSearch:this.userNameSearch, isAdmin:this.authServ.isAdmin(), uploader:this.authServ.getLoggedUserName()};
    
    this.userDataService.getAllUser(this.endecryptionService.encryptData(paginationRequest))
    .subscribe({
      next: (data: any) => 
      {
        var response :PaginationUserData = this.endecryptionService.decryptData(data.response);
        this.totalCount = response.summary.totalCount;
        this.users = response.listOfData as UserModel[];

        if(this.users.length == 0)
        {
          this.notifcationService.showWarning("No user found!");
        }
      },
      error: (err: HttpErrorResponse) => 
      {
        this.notifacationService.showError("Something went wrong during requesting filtered data!");
        console.log(err);
      }
    });
  }

  getFilterNameData ()
  {
    this.ResetPaginator();

    if(this.userNameSearch==="")
    {
      this.getAllData();
    }
    else
    {
      var paginationRequest : PaginationDataRequest = {page:0, pageSize:10, selectedType:this.selectedType, isDescendingOrder:this.isDescendingOrder, filterNameSearch:this.userNameSearch, isAdmin:this.authServ.isAdmin(), uploader:this.authServ.getLoggedUserName()};
    
      this.userDataService.getAllUser(this.endecryptionService.encryptData(paginationRequest))
      .subscribe({
        next: (data: any) => 
        {
          var response :PaginationUserData = this.endecryptionService.decryptData(data.response);
          this.totalCount =response.summary.totalCount;
          this.users = response.listOfData as UserModel[];

          if(this.users.length == 0)
          {
            this.notifcationService.showWarning("No user found!");
          }
        },
        error: (err: HttpErrorResponse) => 
        {
          this.notifacationService.showError("Something went wrong during filtered name user data!");
          console.log(err);
        }
      });     
    }
  }

  public createImgPath (serverPath: string) : string
  { 
    return `${GlobalComponent.appURL}${serverPath}`; 
  }

  EditClick(user: UserModel) :void
  {    
    if(this.authServ.isUser() && ! this.authServ.isAdmin())   
    {
      this.notifacationService.showWarning("User can only upgrade Guest!");
    }

    if(this.authServ.isAdmin() && user.userName === localStorage.getItem("UserName"))   
    {
      this.notifacationService.showWarningWithTitle("Cannot modify your roles!", "Warning Modification!");
    }    
  }

  DeleteClick(user: UserModel) :void
  {  
    if(this.authServ.isAdmin() && user.userName === localStorage.getItem("UserName"))   
    {
      this.notifacationService.showError("Cannot delete yourself!");
    }    
  }

  handlePageEvent(pageEvent: PageEvent) 
  {
    this.currentPage = pageEvent.pageIndex;
    this.users = [];
    var paginationRequest : PaginationDataRequest = {page:this.paginator.pageIndex, pageSize:this.paginator.pageSize, selectedType:this.selectedType, isDescendingOrder:this.isDescendingOrder, filterNameSearch:this.userNameSearch, isAdmin:this.authServ.isAdmin(), uploader:this.authServ.getLoggedUserName()};
    
    this.userDataService.getAllUser(this.endecryptionService.encryptData(paginationRequest))
    .subscribe({
      next: (data: any) =>
      {
        var response :PaginationUserData = this.endecryptionService.decryptData(data.response);
        this.totalCount = response.summary.totalCount;
        this.users = response.listOfData as UserModel[];

        if(this.users.length == 0)
        {
          this.notifcationService.showWarning("No user found!");
        }
      },
      error: (err: HttpErrorResponse) => 
      {
        this.notifacationService.showError("Something went wrong during requesting pages!");
        console.log(err);
      }
    });
  }

  private ModifyOrder()
  {
    if(this.userNameSearch !=="")
    {
      this.getFilterNameData();
    }
    else if ( this.selectedType ==="All")
    {
      this.getAllData();
    }
    else 
    {
      this.getFilterTypeUser(this.selectedType);
    }
  }

  private getAllRawData()
  {
    this.filterName="All";    
    this.userNameSearch ="";
    this.selectedType = "All";
    this.users = [];

    var paginationRequest : PaginationDataRequest = {page:0, pageSize:10, selectedType:this.selectedType, isDescendingOrder:this.isDescendingOrder, filterNameSearch:this.userNameSearch, isAdmin:this.authServ.isAdmin(), uploader:this.authServ.getLoggedUserName()};
    
    this.userDataService.getAllUser(this.endecryptionService.encryptData(paginationRequest))
    .subscribe({
      next: (data: any) => {
        var response :PaginationUserData = this.endecryptionService.decryptData(data.response);
        this.totalCount = response.summary.totalCount;
        this.users = response.listOfData as UserModel[];

        if(this.users.length == 0)
        {
          this.notifcationService.showWarning("No user found!");
        }
      },
      error: (err: HttpErrorResponse) => 
      {
        this.notifacationService.showError("Something went wrong during requesting user data!");
        console.log(err);
      }
    });
  }

  private ResetPaginator()
  {
    this.currentPage = 0;
    this.pageSize = 10;
    this.paginator.pageSize = 10;
    this.paginator.pageIndex = 0;
  }
}
