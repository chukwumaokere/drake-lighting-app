import { Injectable } from '@angular/core';

@Injectable()
export class ImageProvider {
  base64img:string='';

  setImage(img){
    this.base64img=img;
  }
  getImage(){
    return this.base64img;
  }
}
