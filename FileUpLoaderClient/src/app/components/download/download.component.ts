import { Component, Input, OnInit } from '@angular/core';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {
  @Input()  fileUrl: string = "";
  @Input() nameOfButton = "";
  fileName: string = "";
  @Input() uploaderName : string ="";
  @Input() isPrivate : boolean = false;
  
  constructor(private fileSersvice: FileService) {}

  ngOnInit(): void 
  {
    this.fileName = this.fileUrl.split("\\")[this.fileUrl.split("\\").length -1].toString();
  }
  
  downloadFile()
  {
    this.fileSersvice.download(this.fileName,this.uploaderName, this.isPrivate);
  } 
}
