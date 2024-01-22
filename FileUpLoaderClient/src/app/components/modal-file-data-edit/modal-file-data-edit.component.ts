
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalComponent } from 'src/app/global-component';
import { DataFile } from 'src/app/interfaces/datafile.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EncryptionDecryptionService } from 'src/app/services/encryption-decryption.service';
import { FileDataService } from 'src/app/services/file-data.service';
import { NotificaitonService } from 'src/app/services/notificaiton.service';

@Component({
  selector: 'app-modal-file-data-edit',
  templateUrl: './modal-file-data-edit.component.html',
  styleUrls: ['./modal-file-data-edit.component.css']
})
export class ModalFileDataEditComponent implements  OnInit {
  @Input() dataFile : DataFile ={id:"", name:"", description:"", filePath:"", uploader:"", creationDate:new Date(), fileType:"", isPrivate:false};
  @Output() isDataModified:EventEmitter<boolean> =new EventEmitter<boolean>(); 
  ModifieddataFile : DataFile ={id:"", name:"", description:"", filePath:"", uploader:"", creationDate:new Date(),  fileType:"", isPrivate:false};
  apiDbUrl = `${GlobalComponent.appURL}api/DBDataFile/Update`;
  title = 'appBootstrap';
  closeResult: string ='';
  isAllowToEdit : boolean = false;
  isAllowToEditPrivate : boolean = false;

  ngOnInit()
  {
    this.resetValue();
    this.isAllowToEdit = !this.authServ.isUser();
    this.isAllowToEditPrivate = !(this.authServ.isUser()  && ((this.dataFile.uploader === localStorage.getItem("UserName") || this.authServ.isAdmin())));
  }

  constructor(private modalService: NgbModal,
    private authServ: AuthenticationService,
    private notifcationService: NotificaitonService,
    private fileDataService : FileDataService,
    private endecryptionService :EncryptionDecryptionService)
  {
    this.isAllowToEdit = !this.authServ.isUser();
  }

  edit()
  {
    this.fileDataService.editDataFile(this.endecryptionService.encryptData(this.ModifieddataFile))
    .subscribe({      
      error: error => {        
        console.log(error);
        this.notifcationService.showError("There was an error in edition!") 
        this.isDataModified.emit(false);        
      },
      complete: () =>
      {
        this.resetValue();
        this.notifcationService.showSuccess("Edit was success!") 
        this.isDataModified.emit(true);        
      }
    });

    this.modalService.dismissAll();
  }

  open(content : any) 
  {  
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => 
    {
      this.closeResult = `Closed with: ${result}`;
    },
    (reason) => 
    {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getDismissReason(reason: any): string 
  {
    this.resetValue();

    if (reason === ModalDismissReasons.ESC)
    {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK)
    {
      return 'by clicking on a backdrop';
    }
    else
    {
      return  `with: ${reason}`;
    }
  }

  private resetValue() : void 
  {
    this.ModifieddataFile.name = this.dataFile.name;
    this.ModifieddataFile.description = this.dataFile.description;
    this.ModifieddataFile.filePath = this.dataFile.filePath;
    this.ModifieddataFile.fileType = this.dataFile.fileType;
    this.ModifieddataFile.id = this.dataFile.id;
    this.ModifieddataFile.uploader = this.dataFile.uploader;
    this.ModifieddataFile.creationDate = this.dataFile.creationDate;
    this.ModifieddataFile.isPrivate = this.dataFile.isPrivate;
  }
}
