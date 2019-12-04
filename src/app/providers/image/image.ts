//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ImageProvider {
  base64img:string='';

  constructor(/* public http: HttpClient */) {
   
  }
  setImage(img){
    this.base64img=img;
  }
  getImage(){
    return this.base64img;
  }
}
