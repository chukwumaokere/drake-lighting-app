import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from  '@angular/router';

@Component({
  selector: 'app-jha-hospital',
  templateUrl: './jha-hospital.page.html',
  styleUrls: ['./jha-hospital.page.scss'],
})
export class JhaHospitalPage implements OnInit {
  data: any = {};
  serviceid: any;
  constructor(
      private  router: Router,
      public route: ActivatedRoute
  ) { }

    ngOnInit() {
        this.route.queryParams
            .subscribe(params => {
                console.log(params);
                for(let key in params){
                    this.data[key] = params[key];
                    if (params[key] != undefined) {
                        this.data[key] = params[key];
                    }
                }
                console.log(this.data);
                this.serviceid = params.serviceid;
            });
    }

    gotoJHA(){
        this.router.navigate(['/services/jha'], { queryParams: {serviceid: this.data["serviceid"], lat: this.data["lat"], long: this.data["long"], job_name: this.data["job_name"]} });
    }

}
