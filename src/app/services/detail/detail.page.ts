import { Component, OnInit, LOCALE_ID, Inject, } from '@angular/core';
import { ActivatedRoute, Router } from  "@angular/router";
import { NavController, ToastController, AlertController, ModalController  } from '@ionic/angular';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
//import { formatDate } from '@angular/common';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
//import { File } from '@ionic-native/file/ngx';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { ImageProvider } from '../../providers/image/image';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  buttonLabels = ['Take Photo', 'Upload from Library'];

  actionOptions: ActionSheetOptions = {
    title: 'Which would you like to do?',
    buttonLabels: this.buttonLabels,
    addCancelButtonWithLabel: 'Cancel',
    androidTheme: 1 //this.actionSheet.ANDROID_THEMES.THEME_HOLO_DARK,
  }
  options: CameraOptions = {
    quality: 100,
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
  dataReturned : any;
  userinfo: any;
  serviceid: any;
  servicedetails: object;
  servicedetail = {
    tower: '',
    tech1: '',
    tech2: '',
    tech3: '',
    tech4: '',
    tech1_ph: '',
    tech2_ph: '',
    tech3_ph: '',
    tech4_ph: '',
    address_details: '',
    econtact2: '',
    econtact2_ph: '',
    econtact3: '',
    econtact3_ph: '',
    status: '',
    service_type: '',
    subject: '',
    complete_date: '',
    desc: '',
    startdate: '',
    starttime:'',
    duedate: '',
    duetime: '',
    enddate: '',
    endtime: ''
  }
    //actionSheet:any;
  constructor(
      public navCtrl: NavController,
      private  router:  Router,
      public storage: Storage,
      private activatedRoute: ActivatedRoute,
      //public actionSheetController: ActionSheetController,
      private camera: Camera,
      //private file: File,
      public toastController: ToastController,
      public alertController: AlertController,
      private actionSheet: ActionSheet, 
      private photoLibrary: PhotoLibrary,
      public modalCtrl : ModalController,
      public imgpov : ImageProvider,
      @Inject(LOCALE_ID) private locale: string) { }

  loadDetails(serviceid){
    console.log('loading details for service id:', serviceid)
    var result = {
      tower: 'Simmons - MOSPG2014',
      tech1: 'Stanton Neece',
      tech2: 'Austin Shepeard',
      tech3: 'Matt Ferguson',
      tech4: 'Richard Carrigan',
      tech1_ph: '17733072548',
      tech2_ph: '17733072548',
      tech3_ph: '17733072548',
      tech4_ph: '17733072548',
      address_details: '35.045556, -89.906111',
      econtact2: 'Joshua Broder',
      econtact2_ph: '17733072548',
      econtact3: 'Rick Grace',
      econtact3_ph: '17733072548',
      status: 'Open',
      service_type: '',
      subject: 'Radio Implementation Services',
      complete_date: '',
      desc: `This is where the description would be if there was one`,
      startdate: '2019-11-12',
      starttime: '08:00AM',
      duedate: '2019-11-12',
      duetime: '09:00AM',
      enddate: '',
      endtime:'',
      serviceid:serviceid,
    };
    this.servicedetail = result;
  }

  logout(){
    console.log('logout clicked');
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

  async updateCurrentTheme(theme: string){
    var userjson: object;
    await this.isLogged().then(result => {
      if (!(result == false)){
        userjson = result;
      }
    })
    //console.log('from set current theme', userjson.theme);
    userjson['theme'] = theme.charAt(0).toUpperCase() + theme.slice(1);
    //console.log('from set current theme', userjson);
    this.storage.set('userdata', userjson);
    this.userinfo.theme= theme.charAt(0).toUpperCase() + theme.slice(1);
    console.log('updated theme on storage memory');
  }

   async switchTheme(){
    var current_theme;
    await this.getCurrentTheme().then((theme) => {
      console.log("the current theme is", theme);
      current_theme = theme;
    });
    var theme_switcher = {
                          "dark": "light", 
                          "light": "dark"
    };
    var destination_theme = theme_switcher[current_theme]
    console.log('switching theme from:', current_theme);
    console.log('switching theme to:', destination_theme);
    document.body.classList.toggle(destination_theme, true);
    document.body.classList.toggle(current_theme, false);
    this.updateCurrentTheme(destination_theme);
    console.log('theme switched');
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
    console.log('loading theme', theme);
    document.body.classList.toggle(theme, true);
    var theme_switcher = {
      "dark": "light", 
      "light": "dark"
    };
    document.body.classList.toggle(theme_switcher[theme], false); //switch off previous theme if there was one and prefer the loaded theme.
    console.log('turning off previous theme', theme_switcher[theme]);
   }

   pickImage(sourceType) {
    const options: CameraOptions = {
        quality: 100,
        sourceType: sourceType,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        // let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
        // Handle error
    });
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

openActionSheet(serviceid) {
   console.log('launching actionsheet');
   
  this.actionSheet.show(this.actionOptions).then((buttonIndex: number) => {
    console.log('Option pressed', buttonIndex);
    if(buttonIndex == 1){
      console.log('launching camera');
       this.camera.getPicture(this.options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        let base64Image = 'data:image/jpeg;base64,' + imageData;
           this.imgpov.setImage(imageData);
           this.openModal(serviceid,base64Image);
        // TODO: need code to upload to server here.
        // On success: show toast
        //this.presentToastPrimary('Photo uploaded and added! \n' + imageData);          
      }, (err) => {
        // Handle error
        console.error(err);
        // On Fail: show toast
        this.presentToast(`Upload failed! Please try again \n` + err);
      });
    }
     else if(buttonIndex == 2){
       console.log('launching gallery');
      this.camera.getPicture(this.libraryOptions).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        let base64Image = 'data:image/jpeg;base64,' + imageData;
          this.imgpov.setImage(imageData);
          this.openModal(serviceid,base64Image);
        // TODO: need code to upload to server here.
        // On success: show toast
        //this.presentToastPrimary('Photo uploaded and added! \n' + imageData);
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

  ngOnInit() {
    this.activatedRoute.params.subscribe((userData)=>{
      if(userData.length !== 0){
        this.userinfo = userData;
        console.log('param user data:', userData);
        try{ 
          this.loadTheme(userData.theme.toLowerCase());
        }catch{
          console.log('couldnt load theme');
        }
        console.log('param user data length:', userData.length);
        if(userData.serviceid){
          this.loadDetails(userData.serviceid);
        }
        if(userData.length == undefined){
          console.log ('nothing in params, so loading from storage');
          this.isLogged().then(result => {
            if (!(result == false)){
              console.log('loading storage data (within param route function)', result);
              this.userinfo = result;
              this.loadTheme(result.theme.toLowerCase());
            }else{
              console.log('nothing in storage, going back to login');
              this.logout();
            }
          }); 
        }
      }
    });
  }

    async openModal(serviceid,base64Image) {
        const modal = await this.modalCtrl.create({
            component: ImageModalPage,
            componentProps: {
                "base64Image": base64Image,
                "paramTitle": "Edit Photo",
                "serviceid" : serviceid,
            }
        });

        modal.onDidDismiss().then((dataReturned) => {
            if (dataReturned !== null) {
                this.dataReturned = dataReturned.data;
                //alert('Modal Sent Data :'+ dataReturned);
            }
        });

        return await modal.present();
    }
    

}
