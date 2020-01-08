import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet/ngx';
import { AlertController, ToastController, NavController, LoadingController } from '@ionic/angular';
import * as pi from '../../assets/js/sampledata/properties-images.json';
import { Storage } from '@ionic/storage';
import { present } from '@ionic/core/dist/types/utils/overlays';
import { AppConstants } from '../providers/constant/constant';
import { HttpHeaders, HttpClient } from '@angular/common/http';

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
  userinfo: any;
  serviceName: any;
  serviceid: any;
  apiurl: any;

  buttonLabels = ['Take Photo', 'Upload from Library'];

  options: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    saveToPhotoAlbum: false //true causes crash probably due to permissions to access library.
  }

  libraryOptions: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
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

  constructor(
    public storage: Storage, 
    public toastController: ToastController, 
    public alertController: AlertController, 
    private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private camera: Camera, 
    private actionSheet: ActionSheet, 
    private photoLibrary: PhotoLibrary,
    public navCtrl: NavController,
    public loadingController: LoadingController,
    public appConst: AppConstants,
    private httpClient: HttpClient
    ) {
      this.apiurl = this.appConst.getApiUrl();
     }
    loading: any;
    async showLoading() {
      this.loading = await this.loadingController.create({
          message: 'Loading ...'
      });
      return await this.loading.present();
  }

  async hideLoading() {
      setTimeout(() => {
          if(this.loading != undefined){
              this.loading.dismiss();
          }
      }, 1000);
  }
  /* Default Auth Guard and Theme Loader */
  logout(){
    console.log('logging out, no user data found');
    this.storage.set("userdata", null);
    this.router.navigateByUrl('/login');
  }

  async getCurrentTheme(){
    var current_theme = this.storage.get('userdata').then((userdata) => {
      if(userdata && userdata.length !== 0){
        //current_theme = userdata.theme.toLowerCase();
        return userdata.theme.toLowerCase();
      }else{
        return false;
      }
    })
    return current_theme;
  }

  async isLogged(){
    var log_status = this.storage.get('userdata').then((userdata) => {
       if(userdata && userdata.length !== 0){
         return userdata;
       }else{
         return false;
       }
     })
     return log_status;
   }

   loadTheme(theme){
    document.body.classList.toggle(theme, true);
   }

  /* Default Auth Guard and Theme Loader */

  loadImages(recordid){
    /* this.propertyimages = pi.propertiesimages;
    console.log('loading images for', room, recordid);
    var images = this.propertyimages.filter(object => {
      return object.recordid == recordid;
    });
    console.log(images[0].rooms[room].images);
    var pics = images[0].rooms[room].images;
    this.propertypics = pics; */
    var params = {
      recordid: recordid
    }
    console.log('fetching documents for', params);
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin', '*');
    this.showLoading();
    this.httpClient.post(this.apiurl + "getPhotos.php", params, {headers: headers, observe: 'response'})
      .subscribe(data => {
        console.log(data['body']);
        var success = data['body']['success'];
        console.log('fetching photos response was', success);
        if(success == true){
          this.propertypics = data['body']['data'];
        }else{
          console.log('fetch photos failed');
          this.hideLoading();
        }
        this.hideLoading();
      }, error => {
        this.hideLoading();
        console.log('fetch errored out', error);
      })
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
          // On success: show toast
          this.presentToastPrimary('Photo uploaded and added! \n' + imageData);          
        }, (err) => {
          // Handle error
          console.error(err);
          // On Fail: show toast
          this.presentToast(`Upload failed! Please try again \n` + err);
        }); 
      }else if(buttonIndex == 2){
        console.log('launching gallery');
        this.camera.getPicture(this.libraryOptions).then((imageData) => {
          // imageData is either a base64 encoded string or a file URI
          // If it's base64 (DATA_URL):
          let base64Image = 'data:image/jpeg;base64,' + imageData;
          console.log(base64Image);
          // TODO: need code to upload to server here.
          // On success: show toast
          this.presentToastPrimary('Photo uploaded and added! \n' + imageData);
        }, (err) => {
          // Handle error
          console.error(err);
          // On Fail: show toast
          this.presentToast(`Upload failed! Please try again \n` + err);
        }); 
      }
    }).catch((err) => {
      console.log(err);
      this.presentToast(`Operation failed! \n` + err);
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

  async presentToastPrimary(message: string) {
    var toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: "bottom",
      color: "primary"
    });
    toast.present();
  }

  goToDetail(serviceid){
    this.navCtrl.navigateBack(`services/detail/${serviceid}`);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((userData)=>{

      if(userData.length !== 0){
        this.serviceName = userData.servicename;
        this.serviceid = userData.serviceid;
        this.userinfo = userData;
        console.log('param user data:', userData);
        try{ 
          this.loadTheme(userData.theme.toLowerCase());
        }catch{
          console.log('couldnt load theme');
        }
        console.log('param user data length:', userData.length);
        if(userData.length == undefined){
          console.log ('nothing in params, so loading from storage');
          this.isLogged().then(result => {
            if (!(result == false)){
              console.log('loading storage data (within param route function)', result);
              this.userinfo = result;
              this.loadTheme(result.theme.toLowerCase());
              this.loadImages(this.serviceid);
            }else{
              console.log('nothing in storage, going back to login');
              this.logout();
            }
          }); 
        }
      }
    });
  }

}
