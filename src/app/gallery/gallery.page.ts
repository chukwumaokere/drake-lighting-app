import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as pi from '../../assets/js/sampledata/properties-images.json';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
  roomdata: any;
  propertyimages: any;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  loadImages(recordid, room: any){
    this.propertyimages = pi.propertiesimages;
    console.log('loading images', recordid);
    var images = this.propertyimages.filter(object => {
      return object.recordid == recordid;
    });
    return images[0].rooms[room].images;
  }
  ngOnInit() {
    this.activatedRoute.params.subscribe((params)=>{
      console.log(params);
      this.roomdata = params;
      console.log(this.loadImages(params.id, params.room));
    })
  }

}
