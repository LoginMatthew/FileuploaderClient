import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalComponent } from '../global-component';
import * as FileSaver from 'file-saver';
import { NotificaitonService } from './notificaiton.service';

@Injectable()
export class FileService {

  private header! : HttpHeaders;
  private baseApiUrl: string = `${GlobalComponent.appURL}api/File/`;
  
  constructor(private http: HttpClient, private notifcationService: NotificaitonService)
  {
    this.header =new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem("auth_token")}`);
  }

  public download (fileName : string, uploaderName: string, isPrivate : boolean) 
  {    
    this.http.get(`${this.baseApiUrl}DownloadFile?fileName=${fileName}&uploaderName=${uploaderName}&isPrivate=${isPrivate}`,{
    headers :  this.header,
    reportProgress: true,
    responseType: 'blob'
    })
    .subscribe({
      next: (response: any) => 
      {
        this.downLoadFilePopUp(response, fileName);
      },
      complete: () =>
      {
        this.notifcationService.showSuccess("Download was success!");
      },
      error: (err: any) => {
        this.notifcationService.showError("Error in download! message:" + err);
      }
    });
  }

  public deleteFile(deleteFilePath :string )
  {
    return this.http.delete(`${this.baseApiUrl}DeleteFile?filePath=${deleteFilePath}`,  {headers : this.header})
  }

  public multipleUpload(isPrivate : boolean, formData : any )
  {
    return this.http.post(`${this.baseApiUrl}Multipleupload?uploaderName=${localStorage.getItem("UserName")}&isPrivate=${isPrivate}`, formData,  {headers : this.header});
  }

  private downLoadFilePopUp(response: any, fileName : string) {

    console.log("Automatic save");
    FileSaver.saveAs(response,  `${fileName}`);    
  }
}
