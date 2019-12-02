import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ImageProvider {
  base64img:string='';
  url:'http://vortexmobievotingapp.000webhostapp.com/imageUpload.php';

  constructor(public http: HttpClient) {
   
  }
  setImage(img){
    this.base64img=img;
  }
  getImage(){
    return this.base64img;
  }
  uploadPic(){
    let data=this.http.post(this.url,{'img':this.base64img}).map(res=>res);
    data.subscribe(result=>{
      alert(result);
    },error=>{
      alert(error);
    })
  }
}
