import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ImageProvider } from '../../providers/image/image';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
  selector: 'page-identifyphoto',
  templateUrl: 'identifyphoto.html',
})
export class IdentifyphotoPage {
  base64img: string = '';
  constructor(public loadingCtrl: LoadingController, public imgpov: ImageProvider, public nav: NavController, private transfer: FileTransfer) {
    this.base64img = this.imgpov.getImage();
  }

  uploadPic() {
    let loader = this.loadingCtrl.create({
      content: "Uploading...."
    });
    loader.present();

    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: "photo",
      fileName: "test3.jpg",
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {}
    }

    fileTransfer.upload(this.base64img, 'http://192.248.15.229/imageUpload.php', options).then(data => {
      alert(JSON.stringify(data));
      loader.dismiss();
    }, error => {
      alert("error");
      alert("error" + JSON.stringify(error));
      loader.dismiss();
    });
    // this.imgpov.uploadPic();
  }

}
