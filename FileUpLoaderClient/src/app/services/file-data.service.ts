import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalComponent } from '../global-component';

@Injectable()
export class FileDataService {
  private baseURL: string = `${GlobalComponent.appURL}api/DBDataFile/`;
  private header! : HttpHeaders;

  constructor(private http: HttpClient)
  { 
    this.header =new HttpHeaders().append( "Content-Type", "application/json").append('Authorization', `Bearer ${localStorage.getItem("auth_token")}`);
  }  

  public createDataFile(dataFile : string) 
  {
    return this.http.post(`${this.baseURL}CreateDataFile`,  JSON.stringify(dataFile),  {headers : this.header});
  }
  
  public deteleDataFile(deleteId : string)
  {
    return this.http.request('delete',`${this.baseURL}Delete`, { body: JSON.stringify(deleteId), headers: this.header} );
  }

  public editDataFile(modifieddataFile :string)
  {
    return this.http.post(`${this.baseURL}Update`, JSON.stringify(modifieddataFile),  {headers : this.header});
  }

  public getDataFile(paginationDatRequest : string)
  {
    return this.http.request('post',`${this.baseURL}GetDataFilesPerPages`, { body: JSON.stringify(paginationDatRequest), headers: this.header} );
  }
}
