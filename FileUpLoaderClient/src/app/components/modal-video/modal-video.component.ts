import { Component, Input } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-video',
  templateUrl: './modal-video.component.html',
  styleUrls: ['./modal-video.component.css']
})
export class ModalVideoComponent  {
  @Input()  videoSrcURL: string ="";
  @Input()  videoType: string ="";
  @Input()  NameOfVideo: string ="";  
  closeResult: string ='';

  constructor(private modalService: NgbModal) { }    
  
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

  private getDismissReason(reason: any): string 
  {
    if (reason === ModalDismissReasons.ESC)
    {
      return 'by pressing ESC';
    }
    else if (reason === ModalDismissReasons.BACKDROP_CLICK)
    {
      return 'by clicking on a backdrop';
    }
    else
    {
      return  `with: ${reason}`;
    }
  }
}
