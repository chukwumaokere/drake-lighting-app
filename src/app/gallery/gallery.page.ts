import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import * as pi from '../../assets/js/sampledata/properties-images.json';
import { present } from '@ionic/core/dist/types/utils/overlays';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
  roomdata: any;
  propertyimages: any;
  propertypics: any;
  current_mode: any = "view";

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

  constructor(public toastController: ToastController, public alertController: AlertController, private activatedRoute: ActivatedRoute, private router: Router, private camera: Camera, private actionSheet: ActionSheet, private photoLibrary: PhotoLibrary) { }
  

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

  editPhotos(){
    if(this.current_mode == 'view'){
      console.log('entering photo edit mode');
      this.current_mode = 'edit';
      //display X icon top right of each photo div
    }else{
      console.log('returning to view mode');
      this.current_mode = 'view'; //safety for mode
    }
    
  }

  async deletePhoto(recordid){
      const alert = await this.alertController.create({
        header: 'Deleting Photo',
        message: 'Are you sure you want to delete this photo?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('user cancelled request to delete', recordid);
            }
          }, {
            text: 'Delete',
            handler: () => {
              console.log('deleting photo');
              document.getElementById(recordid).style.display = "none";
              //some js to deletephoto function
              //on delete success: 
              console.log('photo deleted', recordid);
              this.presentToast(`Photo deleted!`);
              //this.presentToast(`Photo deleted! ${recordid}`); //If we want to show asset link
              //on fail:
              //console.log('Photo delete failed with error', err);
              //this.presentToast(`Photo delete failed with error ${err}`);
            }
          }
        ]
      });
      await alert.present();
  }

  async presentToast(message: string) {
    var toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: "bottom",
      color: "danger"
    });
    toast.present();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params)=>{
      console.log(params);
      this.roomdata = params;
      this.loadImages(params.id, params.room.replace(' ', ''));
    })
  }

}
