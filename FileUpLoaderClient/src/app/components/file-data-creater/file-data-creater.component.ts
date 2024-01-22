
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { GlobalComponent } from 'src/app/global-component';
import { DataFileToCreate } from 'src/app/interfaces/datafileToCreate.model';
import { dbPathModel } from 'src/app/interfaces/dbpath.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EncryptionDecryptionService } from 'src/app/services/encryption-decryption.service';
import { FileDataService } from 'src/app/services/file-data.service';
import { NotificaitonService } from 'src/app/services/notificaiton.service';

@Component({
  selector: 'app-file-data-creater',
  templateUrl: './file-data-creater.component.html',
  styleUrls: ['./file-data-creater.component.css']
})

export class FileDataCreaterComponent {
  isCreate: boolean= true;
  dFile: DataFileToCreate = {name:"", description:"", filePath:"", uploader:"", creationDate:new Date(),  fileType:"", isPrivate : false}; 
  fileName : string ='';
  fileType : string ='';
  fileSize : number =0;
  isPicture : boolean = false;
  pictureSrc! : string;
  file!: File; //To store file
  private resposneSavedFilePath : dbPathModel = {dbPath:''};

  constructor(private authServ : AuthenticationService,
    private notifacationService : NotificaitonService,
    private fileDataService : FileDataService,
    private endecryptionService : EncryptionDecryptionService,
    private http : HttpClient) 
    {  }

  onCreate = () => 
  {
    this.dFile.name = this.dFile.name==="" ? this.file?.name : this.dFile.name;
    this.dFile.description= this.dFile.description === "" ? this.file?.type : this.dFile.description;
    this.dFile.uploader=this.authServ.getLoggedUserName();
    this.dFile.creationDate=new Date();
    this.dFile.isPrivate=this.dFile.isPrivate;
    this.dFile.filePath = this.resposneSavedFilePath.dbPath;
    this.dFile.fileType = this.file.type;

    this.fileDataService.createDataFile(this.endecryptionService.encryptData(this.dFile))
    .subscribe({
      complete:() => 
      {
        this.isCreate = false;
        this.pictureSrc = '';
        this.fileName = '';
        this.notifacationService.showSuccess("Successfull file upload!");
      },
      error: (err: HttpErrorResponse) =>
      {
        this.notifacationService.showErrorWithTitle("Error in data creation!", "Error in FileDB");
        console.log(err);
      }
    });
  }

  returnToCreate () : void
  {
    this.isCreate = true;
    this.dFile.name ='';
    this.dFile.description ='';
    this.dFile.isPrivate = false;
  }

  public createImgPath (serverPath: string) : string 
  { 
    return `${GlobalComponent.appURL}${serverPath}`; 
  }

  onChange(event: any) 
  {
    const selectedFile: File = event.target.files[0];

    if (selectedFile)
    {
      this.isPicture = selectedFile.type.includes("image");
      this.file = selectedFile;
      this.fileName =selectedFile.name;
      this.fileSize = selectedFile.size;
      this.fileType = selectedFile.type;
      this.createImageUrl();
    }
  }

  createImageUrl() 
  {
    let reader = new FileReader();

    if (this.file!= null)
      reader.readAsDataURL(this.file);

    reader.onload = () =>
    {
      this.pictureSrc= reader.result as string;
    };
  }

  uploadFile () 
   {
    if(this.file === null)
    {
      console.log("File is null");
      this.notifacationService.showErrorWithTitle("File is null", "Null File");
    }

    var formData = new FormData();
    var extenstion  = (this.file.name.split(".")[this.file.name.split(".").length-1]).toString();
    var fileName = this.file.name.substring(0,this.file.name.length-(extenstion.length)-1);  
    var newFileName =  fileName+"_"+Date.now().toString()+"."+extenstion;
    formData.append('file', this.file, newFileName);
  
    this.http.post(`${GlobalComponent.appURL}api/File/Singleupload?uploaderName=${localStorage.getItem("UserName")}&isPrivate=${this.dFile.isPrivate}`, formData, {headers : new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem("auth_token")}`), reportProgress: true , observe : 'events'}).subscribe
    (
      {
        next : (event :any) =>
        {          
          this.resposneSavedFilePath = event.body;
        },
        complete:() =>
        {
          this.onCreate();
        },
        error: (err: HttpErrorResponse) => 
        {
          console.log(err);
          this.notifacationService.showErrorWithTitle("Cannot upload file", "Error in FileUpload");
        }
      }
    );
  }
}
