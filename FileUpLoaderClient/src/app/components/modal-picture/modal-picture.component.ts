import { Component, Input, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-picture',
  templateUrl: './modal-picture.component.html',
  styleUrls: ['./modal-picture.component.css']
})
export class ModalPictureComponent    {
  name = 'Angular ' ;
  @Input()  imgSrcURL: string ="";
  @Input()  NameOfPicture: string ="";  
  @Input()  Description: string ="";
  imgSrc:string =""; 
  closeResult: string ='';

  onClick(event : any)
  {
    const imgElem = event.target;
    var target = event.target || event.srcElement || event.currentTarget;
    var srcAttr = target.attributes.src;
    this.imgSrc = srcAttr.nodeValue;
  }

  constructor(private modalService: NgbModal)
  {
    if(this.NameOfPicture.includes("."))
    {
      this.NameOfPicture = this.NameOfPicture.split(".")[0];
    }
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
