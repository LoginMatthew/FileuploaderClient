import { HttpErrorResponse} from '@angular/common/http';
import { Component, OnInit,  AfterViewInit, ViewChild } from '@angular/core';
import { GlobalComponent } from 'src/app/global-component';
import { DataFile } from 'src/app/interfaces/datafile.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PaginationFileData } from 'src/app/interfaces/PaginationData';
import { NotificaitonService } from 'src/app/services/notificaiton.service';
import { FileDataService } from 'src/app/services/file-data.service';
import { PaginationDataRequest } from 'src/app/interfaces/PaginationFileDataRequest';
import { EncryptionDecryptionService } from 'src/app/services/encryption-decryption.service';

@Component({
  selector: 'app-show-all-file',
  templateUrl: './show-all-file.component.html',
  styleUrls: ['./show-all-file.component.css']
})
export class ShowAllFileComponent  implements OnInit, AfterViewInit {
  dFiles: DataFile[] = [];
  resultGet!: PaginationFileData;
  selectedType ="";
  fileNameSearch : string ="";
  filterName : string="";
  totalCount! : number;
  pageEvent!: PageEvent;
  datasource!: null;
  currentPage!:number;
  pageSize!:number;  
  isDescendingOrder! : boolean;
  displayedColumns = ['content', 'details', 'options'];  
  dataSource: MatTableDataSource<DataFile> = new MatTableDataSource(this.dFiles);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private authServ: AuthenticationService,
    private notifcationService: NotificaitonService,
    private fileDataService : FileDataService,
    private endecryptionService :EncryptionDecryptionService)
  { 
    this.isDescendingOrder = false;
  }

  ngAfterViewInit()
  {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  isDeleteAllowed(dFile : DataFile) : boolean
  {
    const userName= this.authServ.getLoggedUserName();

    if ((userName != "" && dFile.uploader === userName) || this.authServ.isAdmin())
      return true;

    return false;
  }

  ngOnInit()
  {
    this.getAllRawData();
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
      this.selectedType =="" ?  this.getAllData() : this.getFilterTypeData(this.selectedType,this.filterName);
    }
    else
    {
      this.notifcationService.showWarning("Cannot modify");    
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
  
  getFilterTypeData (fileType :string, filterName:string) 
  {
    this.ResetPaginator();
    this.filterName=filterName;    
    this.fileNameSearch ="";
    this.selectedType = fileType;
    var paginationRequest : PaginationDataRequest = {page:0, pageSize:5, selectedType:this.selectedType, isDescendingOrder:this.isDescendingOrder, filterNameSearch:this.fileNameSearch, isAdmin:this.authServ.isAdmin(), uploader:this.authServ.getLoggedUserName()};
    
    this.fileDataService.getDataFile(this.endecryptionService.encryptData(paginationRequest))
    .subscribe({
      next: (data: any) => 
      {
        var response :PaginationFileData = this.endecryptionService.decryptData(data.response);
        this.totalCount = response.summary.totalCount;
        this.dFiles = response.listOfData as DataFile[];

        if(this.dFiles.length == 0)
        {
          this.notifcationService.showWarning("No data found!");
        }
      },
      error: (error: HttpErrorResponse) => 
      {
        console.log(error);
        this.notifcationService.showError("Something went wrong during requesting Filter!");
      }
    });
  }

  getFilterNameData () 
  {
    this.ResetPaginator();

    if(this.fileNameSearch==="")
    {
      this.getAllData();
    }
    else
    {
      var paginationRequest : PaginationDataRequest = {page:0, pageSize:5, selectedType:this.selectedType, isDescendingOrder:this.isDescendingOrder, filterNameSearch:this.fileNameSearch, isAdmin:this.authServ.isAdmin(), uploader:this.authServ.getLoggedUserName()};
    
      this.fileDataService.getDataFile(this.endecryptionService.encryptData(paginationRequest))
      .subscribe({
        next: (data: any) => 
        {
          var response :PaginationFileData = this.endecryptionService.decryptData(data.response);
          this.totalCount = response.summary.totalCount;
          this.dFiles = response.listOfData as DataFile[];

          if(this.dFiles.length == 0)
          {
            this.notifcationService.showWarning("No data found!");
          }
        },
        error: (error: HttpErrorResponse) => 
        {
          console.log(error);
          this.notifcationService.showError("Something went wrong during requesting filterNameData!");
        }
      });     
    }
  }

  createImgPath(serverPath: string) : string
  { 
    return `${GlobalComponent.appURL}${serverPath}`; 
  }

  handlePageEvent(pageEvent: PageEvent) 
  {
    this.currentPage = pageEvent.pageIndex;
    this.dFiles = [];
    var paginationRequest : PaginationDataRequest = {page:this.paginator.pageIndex, pageSize:this.paginator.pageSize, selectedType:this.selectedType, isDescendingOrder:this.isDescendingOrder, filterNameSearch:this.fileNameSearch, isAdmin:this.authServ.isAdmin(), uploader:this.authServ.getLoggedUserName()};
    
    this.fileDataService.getDataFile(this.endecryptionService.encryptData(paginationRequest))
    .subscribe({
      next: (data: any) => {
        var response :PaginationFileData = this.endecryptionService.decryptData(data.response);
        this.totalCount = response.summary.totalCount;
        this.dFiles = response.listOfData as DataFile[];

        if(this.dFiles.length == 0)
        {
          this.notifcationService.showWarning("No data found!");
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.notifcationService.showError("Something went wrong during requesting page!");
      }
    });
  }

  private ModifyOrder()
  {
    if(this.fileNameSearch !=="")
    {
      this.getFilterNameData();
    }
    else if ( this.selectedType ==="All")
    {
      this.getAllData();
    }
    else 
    {
      this.getFilterTypeData(this.selectedType, this.filterName);
    }
  }
  
  private getAllRawData()
  {
    this.filterName="All";    
    this.fileNameSearch ="";
    this.selectedType = "All";
    this.dFiles = [];
    var paginationRequest : PaginationDataRequest = {page:0, pageSize:5, selectedType:this.selectedType, isDescendingOrder:this.isDescendingOrder, filterNameSearch:this.fileNameSearch, isAdmin:this.authServ.isAdmin(), uploader:this.authServ.getLoggedUserName()};
        
    this.fileDataService.getDataFile(this.endecryptionService.encryptData(paginationRequest))
    .subscribe({ 
      next: (data: any) =>
      {
        var response :PaginationFileData = this.endecryptionService.decryptData(data.response);
        this.totalCount = response.summary.totalCount;        
        this.dFiles = response.listOfData as DataFile[];

        if(this.dFiles.length == 0)
        {
          this.notifcationService.showWarning("No data found!");
        }
      },
      error: (error: HttpErrorResponse) =>
      {
        console.log(error);
        this.notifcationService.showError("Something went wrong during requesting All Data!");
      }
    });
  }

  private ResetPaginator()
  {
    this.currentPage = 0;
    this.pageSize = 5;
    this.paginator.pageSize = 5;
    this.paginator.pageIndex = 0;
  }
}
