
# Fileuploader Client

A simple application which is enable at home to store file by the server and client.
People are able to store files and check the uploaded files and able to download them which are uploaded.
The layout of the pages is also optimized for mobile use (Tested on firefox (desktop) and google chrome (mobile)). This program is perfect to use to share files between family members at home.

## The client project

The client and a server send/get encrypted data
The anulgar project uses the following:Angular v17 HTML, TypeScript, CSS, Bootstrap, Angular Material, Toaster, crypto, file saver 

Project packages:
@angular-devkit/build-angular@17.1.0
@angular/animations@17.1.0
@angular/cdk@17.1.0
@angular/cli@17.1.0
@angular/common@17.1.0
@angular/compiler-cli@17.1.0
@angular/compiler@17.1.0
@angular/core@17.1.0
@angular/forms@17.1.0
@angular/localize@17.1.0
@angular/material@17.1.0
@angular/platform-browser-dynamic@17.1.0
@angular/platform-browser@17.1.0
@angular/router@17.1.0
@auth0/angular-jwt@5.2.0
@ng-bootstrap/ng-bootstrap@15.1.1
@popperjs/core@2.11.8
@types/crypto-js@4.2.1
@types/file-saver@2.0.5
@types/jasmine@4.3.6
boostrap@2.0.0
bootstrap-icons@1.11.1
bootstrap@5.3.2
crypto-js@4.2.0
file-saver@2.0.5
jasmine-core@4.6.0
karma-chrome-launcher@3.2.0
karma-coverage@2.2.1
karma-jasmine-html-reporter@2.1.0
karma-jasmine@5.1.0
karma@6.4.2
ngx-toastr@18.0.0
rxjs@7.8.1
tslib@2.6.2
typescript@5.3.3
zone.js@0.14.3


*** Additional descripion about the project is on the 'about' page in the related client project. ***

## Development server

Run `ng serve` for a dev server and rewrite the "app.module.ts" address(127.0.0.1) and port(4200). Navigate to `http://localhost:4200/` or `http://127.0.0.1:4200/`.
Otherwise to run at home check your Server address and modify "global-component.ts" file address and port.
Navigate in cmd  the project folder and enter"ng serve --host YourServerIPAddress --port DesiredServerPortNumber". In the browser Navigate to `http://YourIPServerIpAddress:YourGivenPortNumber/`.


## Further help

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.1.0.
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
