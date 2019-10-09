import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet/ngx';
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
  buttonLabels = ['Take Photo', 'Upload from Library'];

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    saveToPhotoAlbum: true
  }

  libraryOptions: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
  }

  actionOptions: ActionSheetOptions = {
    title: 'Which would you like to do?',
    buttonLabels: this.buttonLabels,
    addCancelButtonWithLabel: 'Cancel',
    androidTheme: 1 //this.actionSheet.ANDROID_THEMES.THEME_HOLO_DARK,
  }

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private camera: Camera, private actionSheet: ActionSheet, private photoLibrary: PhotoLibrary) { }
  

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
    console.log('launching actionsheet');
    this.actionSheet.show(this.actionOptions).then((buttonIndex: number) => {
      console.log('Option pressed', buttonIndex);
      if(buttonIndex == 1){
        console.log('launching camera');
        this.camera.getPicture(this.options).then((imageData) => {
          // imageData is either a base64 encoded string or a file URI
          // If it's base64 (DATA_URL):
          let base64Image = 'data:image/jpeg;base64,' + imageData;
          console.log(base64Image);
          // TODO: need code to upload to server here.
        }, (err) => {
          // Handle error
          console.error(err);
        }); 
      }else if(buttonIndex == 2){
        console.log('launching gallery');
        this.camera.getPicture(this.libraryOptions).then((imageData) => {
          // imageData is either a base64 encoded string or a file URI
          // If it's base64 (DATA_URL):
          let base64Image = 'data:image/jpeg;base64,' + imageData;
          console.log(base64Image);
          // TODO: need code to upload to server here.
        }, (err) => {
          // Handle error
          console.error(err);
        }); 
      }
    }).catch((err) => {
      console.log(err);
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
