import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MultipleFileUploadComponent } from './components/multiple-file-upload/multiple-file-upload.component';
import { ShowAllFileComponent } from './components/show-all-file/show-all-file.component';
import { FileDataCreaterComponent } from './components/file-data-creater/file-data-creater.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './services/guards/auth.guard';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { UserGuard } from './services/guards/user.guard';
import { RegisterComponent } from './components/register/register.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { AboutComponent } from './components/about/about.component';

const routes: Routes = [
  {path: "multiplefileupload", component:MultipleFileUploadComponent, canActivate: [AuthGuard, UserGuard]},
  {path: "fileDataToUpload", component:FileDataCreaterComponent, canActivate: [AuthGuard, UserGuard]},
  {path: "showAllData", component:ShowAllFileComponent, canActivate:[AuthGuard]},
  {path: "showUser", component:UserListComponent, canActivate:[AuthGuard]},
  {path: "login", component:LoginComponent},
  {path: "register", component:RegisterComponent},
  {path: "about", component:AboutComponent, canActivate: [AuthGuard]},
  {path: '404', component:NotfoundComponent},
  {path: "home", component:HomeComponent, canActivate: [AuthGuard]},
  {path: 'forbidden', component: ForbiddenComponent},
  {path:"", redirectTo: "/home", pathMatch: "full"},
  {path: '**', redirectTo: '/404', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
