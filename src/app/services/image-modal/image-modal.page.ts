import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController, PickerController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ImageProvider } from '../../providers/image/image';
import { AppConstants } from '../../providers/constant/constant';
import { LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-image-modal',
    templateUrl: './image-modal.page.html',
    styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {
    imageData: any;
    modalTitle: string;
    modelId: number;
    serviceid: any;
    apiurl: any;
    photo = {
        title: '',
        primary_title: '',
        secondary_title: '',
        tower_section: '',
        serviceid: '',
        base64Image: ''
    };

    constructor(
        private modalController: ModalController,
        private navParams: NavParams,
        public httpClient: HttpClient,
        private pickerCtrl: PickerController,
        private transfer: FileTransfer,
        private formBuilder: FormBuilder,
        public toastController: ToastController,
        public imgpov: ImageProvider,
        public appConst: AppConstants,
        public loadingController: LoadingController
    ) {
        this.imageData = this.imgpov.getImage();
        this.apiurl = this.appConst.getApiUrl();
    }

    ngOnInit() {
        //console.table(this.navParams);
        this.modelId = this.navParams.data.paramID;
        this.serviceid = this.navParams.data.serviceid;
        this.modalTitle = this.navParams.data.paramTitle;
    }

    async closeModal() {
        const onClosedData: string = "Wrapped Up!";
        await this.modalController.dismiss(onClosedData);
    }

    async showPicker() {
        var x;
        var optionValues = [];
        for (x = 0; x < 101; x++) {
            optionValues.push({ text: x, value: x })
        }
        let opts = {
            cssClass: 'section-picker',
            buttons: [
                { text: 'Cancel', role: 'cancel', cssClass: 'section-picker-cancel' },
                { text: 'Confirm', cssClass: 'section-picker-confirm' },
            ],
            columns: [{
                name: 'section',
                options: optionValues
            }],
        }

        let picker = await this.pickerCtrl.create(opts);
        picker.present();
        picker.onDidDismiss().then(async data => {
            let col = await picker.getColumn('section');
            if (col.options[col.selectedIndex].text) {
                this.photo.tower_section = col.options[col.selectedIndex].text;
                if (this.photo.primary_title !== '' || this.photo.secondary_title !== '') {
                    this.photo.title = this.photo.primary_title + "-" + this.photo.secondary_title + "-" + this.photo.tower_section;
                } else {
                    this.photo.title = this.photo.tower_section;
                }
                //this.photo.title = this.photo.primary_title + "-" + this.photo.secondary_title + "-" + col.options[col.selectedIndex].text;
            }
        })
    }

    loading: any;

    async showLoading() {
        console.log('loading image modal');
        this.loading = await this.loadingController.create({
            message: 'Loading ...'
        });
        this.loading.present();
    }

    async hideLoading() {
        this.loading.dismiss();
    }


    modifyTowerSection(direction) {
        if (direction == 'up') {
            var val = parseInt(this.photo.tower_section) + 1;
            this.photo.tower_section = val.toString();
            this.photo.title = this.photo.primary_title + "-" + this.photo.secondary_title + "-" + this.photo.tower_section;
        } else if (direction == 'down') {
            var val = parseInt(this.photo.tower_section) - 1;
            this.photo.tower_section = val.toString();
            this.photo.title = this.photo.primary_title + "-" + this.photo.secondary_title + "-" + this.photo.tower_section;
        }
    }

    async  uploadImage(form) {
        //console.log('form submitted',form.value);
        /*const fileTransfer: FileTransferObject = this.transfer.create();
        let options: FileUploadOptions = {
            fileKey: "photo",
            fileName: "test3.jpg",
            chunkedMode: false,
            mimeType: "image/jpeg",
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            params: {
                "title": form.value.title
            },
        }
        fileTransfer.upload(this.imageData, 'http://devl06.borugroup.com/drakelighting/phoneapi/postPhotos.php?recordid=108405', options).then(data => {
            console.log(JSON.stringify(data));
            this.presentToastPrimary('Photo uploaded and added to Service \n');
        }, error => {
            console.log(error);
            console.error(JSON.stringify(error));
            this.presentToast("Upload failed! Please try again \n" + error.message);
        });*/


        var headers = new HttpHeaders();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        form.value.base64Image = this.imageData;
        form.value.serviceid = this.serviceid;
        console.log('adding photo for', form.value.serviceid);
        this.showLoading();
        this.httpClient.post(this.apiurl + "postPhotos.php", form.value, { headers: headers, observe: 'response' })
            .subscribe(data => {
                this.hideLoading();
                //console.log(data['_body']);
                if (data['body']['success'] == true) {
                    this.presentToastPrimary('Photo uploaded and added to Work Order \n');
                    this.closeModal();
                } else {
                    console.log('upload failed');
                    this.presentToast('Upload failed! Please try again \n');
                }
            }, error => {
                this.hideLoading();
                //console.log(error);
                //console.log(error.message);
                //console.error(error.message);
                this.presentToast("Upload failed! Please try again \n" + error.message);
            });
    }

    async  fillTitlePrimary(title) {
        this.photo.primary_title = title;
        if (this.photo.secondary_title !== '' || this.photo.tower_section !== '') {
            this.photo.title = this.photo.primary_title + "-" + this.photo.secondary_title + "-" + this.photo.tower_section;
        } else {
            this.photo.title = title;
        }
    }
    async  fillTitleSecondary(title) {
        this.photo.secondary_title = title;
        if (this.photo.primary_title !== '' || this.photo.tower_section !== '') {
            this.photo.title = this.photo.primary_title + "-" + this.photo.secondary_title + "-" + this.photo.tower_section;
        } else {
            this.photo.title = this.photo.secondary_title;
        }

    }
    async  fillTowerSection(section) {
        this.photo.tower_section = section;
        if (this.photo.primary_title !== '' || this.photo.secondary_title !== '') {
            this.photo.title = this.photo.primary_title + "-" + this.photo.secondary_title + "-" + this.photo.tower_section;
        } else {
            this.photo.title = this.photo.tower_section;
        }
    }

    async presentToast(message: string) {
        var toast = await this.toastController.create({
            message: message,
            duration: 3500,
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
