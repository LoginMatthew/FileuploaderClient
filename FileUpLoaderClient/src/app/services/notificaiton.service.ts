import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificaitonService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message : string)
  {
      this.toastr.success(message, "Success");
  }

  showSuccessWithTitle(message : string, title : string)
  {
      this.toastr.success(message, title);
  }

  showError(message : string)
  {
      this.toastr.error(message,"Error");
  }

  showErrorWithTitle(message : string, title : string)
  {
      this.toastr.error(message, title);
  }

  showInfo(message : string)
  {
    this.toastr.info(message, "Info");
  }
  
  showInfoWithTitle(message : string, title : string)
  {
      this.toastr.info(message, title);
  } 

  showWarning(message : string)
  {
      this.toastr.warning(message, "Warning");
  }

  showWarningWithTitle(message : string, title : string)
  {
      this.toastr.warning(message, title);
  }
}
