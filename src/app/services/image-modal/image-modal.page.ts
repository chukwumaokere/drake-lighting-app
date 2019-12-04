import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController, PickerController, } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
/*import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file';*/
import {Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {

modalTitle:string;
modelId:number;
photo = {
    title: '',
    primary_title:'',
    secondary_title:'',
    tower_section: '',
    serviceid: '',
    base64Image: ''
    };

constructor(
private modalController: ModalController,
private navParams: NavParams,
public httpClient: HttpClient,
private pickerCtrl: PickerController,
/*private transfer: FileTransfer,*/
private formBuilder: FormBuilder,
public toastController: ToastController,
) {
    /*this.photo = this.formBuilder.group({
        title: ['', Validators.required],
        serviceid: [''],
    });*/
}

  ngOnInit() {
  console.table(this.navParams);
    this.modelId = this.navParams.data.paramID;
    this.modalTitle = this.navParams.data.paramTitle;
  }

  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(onClosedData);
  }

  async showPicker(){
      var x;
      var optionValues = [];
      for(x=0; x < 101; x++){
        optionValues.push({text: x, value: x})
      }
      let opts = {
        cssClass: 'section-picker',
        buttons: [
         {text: 'Cancel', role: 'cancel', cssClass: 'section-picker-cancel'},
         {text: 'Confirm', cssClass: 'section-picker-confirm'},
        ],
        columns: [{
            name: 'section',
            options: optionValues
        }],
      }

      let picker = await this.pickerCtrl.create(opts);
      picker.present();
      picker.onDidDismiss().then( async data => {
          let col = await picker.getColumn('section');
          if(col.options[col.selectedIndex].text){
            this.photo.title = this.photo.primary_title + "-" + this.photo.secondary_title + "-" + col.options[col.selectedIndex].text;
          }
      })
  }

  async  uploadImage(form){
      console.log('form submitted',form.value);
      /*const fileTransfer: FileTransferObject = this.transfer.create();
      let options: FileUploadOptions = {
          fileKey: "photo",
          fileName: "test3.jpg",
          chunkedMode: false,
          mimeType: "image/jpeg",
          headers: {}
      }
      fileTransfer.upload(this.base64img, 'http://localhost/drakelighting/phoneapi/postPhotos.php', options).then(data => {
          alert(JSON.stringify(data));
      }, error => {
          alert("error");
          alert("error" + JSON.stringify(error));
      });*/

      const requestOptions = {
          headers: new HttpHeaders({
              'Access-Control-Allow-Methods': "GET, POST",
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers':'Content-Type',
              'Content-Type':  'application/json',
          })
      };

      this.httpClient.post("http://devl06.borugroup.com/drakelighting/phoneapi/postPhotos.php", form.value, requestOptions)
          .subscribe(data => {
              console.log(data['_body']);
              this.presentToastPrimary('Photo uploaded and added to Service \n');
          }, error => {
              console.log(error);
              console.log(error.message);
              console.error(error.message);
              this.presentToast("Upload failed! Please try again \n" + error.message);
          });


    this.closeModal();
  }

  async  fillTitlePrimary(title){
      this.photo.primary_title = title;
      this.photo.title = title;
  }
  async  fillTitleSecondary(title){
    this.photo.secondary_title = title;
    this.photo.title = this.photo.primary_title + "-" + this.photo.secondary_title;
    }
    async  fillTowerSection(section){
        this.photo.tower_section = section;
        this.photo.title = this.photo.primary_title + "-" + this.photo.secondary_title + "-" + this.photo.tower_section ;
    }

    async presentToast(message: string) {
        var toast = await this.toastController.create({
            message: message,
            duration: 5500,
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
}
