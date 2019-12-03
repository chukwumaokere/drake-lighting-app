import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file';
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
    serviceid: '',
    base64Image: ''
    };

constructor(
private modalController: ModalController,
private navParams: NavParams,
public httpClient: HttpClient,
private transfer: FileTransfer,
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
              'Content-Type':  'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Origin': '*'
          })
      };

      this.httpClient.post("https://devl06.borugroup.com/drakelighting/phoneapi/postPhotos.php", form.value, requestOptions)
          .subscribe(data => {
              console.log(data['_body']);
              this.presentToastPrimary('Photo uploaded and added to Service \n');
          }, error => {
              console.log(error);
              this.presentToast('Upload failed! Please try again');
          });


    this.closeModal();
  }

  async  fillTitle(title){
      this.photo.title = title;
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
}
