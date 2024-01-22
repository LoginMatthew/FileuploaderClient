import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NotificaitonService } from "src/app/services/notificaiton.service";
import { FileService } from "src/app/services/file.service";

@Component({
  selector: "app-multiple-file-upload",
  templateUrl: "./multiple-file-upload.component.html",
  styleUrls: ["./multiple-file-upload.component.css"],
})

export class MultipleFileUploadComponent {
  status: "initial" | "uploading" | "success" | "fail" = "initial";
  files: File[] = [];
  isPrivate : boolean = false;

  constructor(private http: HttpClient,
    private notifcationService: NotificaitonService,
    private fileService : FileService) {}

  onChange(event: any) 
  {
    const files = event.target.files;

    if (files.length)
    {
      this.status = "initial";
      this.files = files;
    }
  }

  onUpload() 
  {
    if (this.files.length)
    {
      const formData = new FormData();

      [...this.files].forEach((file) => {
        var extenstion  = (file.name.split(".")[file.name.split(".").length-1]).toString();
        var fileName = file.name.substring(0,file.name.length-(extenstion.length)-1);    
        var newFileName =  fileName+"_"+Date.now().toString()+"."+extenstion;
        formData.append("file", file, newFileName);
      });

      var upload$ = this.fileService.multipleUpload(this.isPrivate, formData);
      this.status = "uploading";

      upload$.subscribe({
        complete: () =>
        {
          this.status = "success";
          this.notifcationService.showSuccess("File upload was successful!");
        },
        error: (error: any) => 
        {
          this.status = "fail";
          this.notifcationService.showError("Something went wrong during upload!");
        },
      });
    }
  }
}
