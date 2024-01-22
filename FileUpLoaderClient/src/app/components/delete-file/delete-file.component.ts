import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EncryptionDecryptionService } from 'src/app/services/encryption-decryption.service';
import { FileDataService } from 'src/app/services/file-data.service';
import { FileService } from 'src/app/services/file.service';
import { NotificaitonService } from 'src/app/services/notificaiton.service';

@Component({
  selector: 'app-delete-file',
  templateUrl: './delete-file.component.html',
  styleUrls: ['./delete-file.component.css']
})
export class DeleteFileComponent {
  @Input() deleteId : string = "";
  @Input() deleteFilePath : string = "";
  @Output() isDeleted:EventEmitter<boolean> =new EventEmitter<boolean>(); 

  constructor(private http: HttpClient,
    private notifcationService: NotificaitonService,
    private fileDataService : FileDataService,
    private fileService : FileService,
    private endecryptionService :EncryptionDecryptionService){ }

  delete () {
     this.DeleteDbData();
  }

 async  DeleteDbData () 
  {
    this.fileDataService.deteleDataFile(this.endecryptionService.encryptData(this.deleteId)).subscribe({
      error: error => 
      {
        this.notifcationService.showError("Something went wrong in dataFile deletion!");
        console.error('There was an error!', error);
        this.isDeleted.emit(false);         
      },
      complete :() =>
      {
        this.DeleteFileData();
      }
    });
  }

  async DeleteFileData  () 
  {
    this.fileService.deleteFile(this.deleteFilePath)
    .subscribe({
      complete: () =>
      {
        this.notifcationService.showSuccess("Item was deleted successfully!");
        this.isDeleted.emit(true);
      },
      error: error => {
        this.notifcationService.showError("Something went wrong in File deletion!");
        console.error('There was an error!', error);
        this.isDeleted.emit(false);
        this.notifcationService.showError("Item was not deleted!");
      }
    });
  }
}
