import { Injectable } from '@angular/core';
import { GlobalComponent } from '../global-component';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncryptionDecryptionService {

  private key = CryptoJS.enc.Utf8.parse(GlobalComponent.encrpytionKey);
  private iv = CryptoJS.enc.Utf8.parse(GlobalComponent.encrpytionKey);

  public encryptData (data : any): string
  {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString();;
  }

  public decryptData (data : any) : any
  {
    var bytes  = CryptoJS.AES.decrypt(data, this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
}
