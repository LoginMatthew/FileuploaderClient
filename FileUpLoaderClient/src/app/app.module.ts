import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MultipleFileUploadComponent } from './components/multiple-file-upload/multiple-file-upload.component';
import { DownloadComponent } from './components/download/download.component';
import { NgbModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ShowAllFileComponent } from './components/show-all-file/show-all-file.component';
import { ModalPictureComponent } from './components/modal-picture/modal-picture.component';
import { DeleteFileComponent } from './components/delete-file/delete-file.component';
import { FileDataCreaterComponent } from './components/file-data-creater/file-data-creater.component';
import { ModalVideoComponent } from './components/modal-video/modal-video.component';
import { ModalFileDataEditComponent } from './components/modal-file-data-edit/modal-file-data-edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthGuard } from './services/guards/auth.guard';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { RegisterComponent } from './components/register/register.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ModalEditUserComponent } from './components/modal-edit-user/modal-edit-user.component';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatBadgeModule} from '@angular/material/badge';
import { NotificaitonService } from './services/notificaiton.service';
import { ToastrModule } from 'ngx-toastr';
import { EncryptionDecryptionService } from './services/encryption-decryption.service';
import { FileDataService } from './services/file-data.service';
import { FileService } from './services/file.service';
import { UserDataService } from './services/user.data.service';
import { AutoLougoutService } from './services/auto.logout.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { AboutComponent } from './components/about/about.component';

export function tokenGetter() { 
  return localStorage.getItem("jwt"); 
}

@NgModule({
  declarations: [
    AppComponent,
    MultipleFileUploadComponent,
    DownloadComponent,
    ShowAllFileComponent,
    ModalPictureComponent,
    DeleteFileComponent,
    FileDataCreaterComponent,
    ModalVideoComponent,
    ModalFileDataEditComponent,
    LoginComponent,
    HomeComponent,
    NotfoundComponent,
    ForbiddenComponent,
    RegisterComponent,
    UserListComponent,
    ModalEditUserComponent,
    AboutComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,    
    FormsModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatTableModule,
    MatBadgeModule, MatButtonModule, MatIconModule,
    NgbToastModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
    ToastrModule.forRoot({positionClass:"toast-bottom-left"}),

    //injection!
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["http://192.168.1.1:5003"],
        disallowedRoutes: []
      }
    })
  ],
  providers: [{provide: FileService},
              AuthGuard,
              FileDataService,
              NotificaitonService,
              EncryptionDecryptionService,
              UserDataService,
              {provide: AutoLougoutService}
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
