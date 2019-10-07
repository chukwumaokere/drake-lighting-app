import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import * as pi from '../../assets/js/sampledata/properties-images.json';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
  roomdata: any;
  propertyimages: any;
  propertypics: any;

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private camera: Camera) { }

  loadImages(recordid, room: any){
    this.propertyimages = pi.propertiesimages;
    console.log('loading images for', room, recordid);
    var images = this.propertyimages.filter(object => {
      return object.recordid == recordid;
    });
    console.log(images[0].rooms[room].images);
    var pics = images[0].rooms[room].images;
    this.propertypics = pics;
  }
  launchCamera(){
    console.log('launching camera');
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      // TODO: need code to upload to server here.
     }, (err) => {
      // Handle error
     });
  }

 
  
  
  ngOnInit() {
    this.activatedRoute.params.subscribe((params)=>{
      console.log(params);
      this.roomdata = params;
      this.loadImages(params.id, params.room.replace(' ', ''));
    })
  }

}
