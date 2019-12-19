import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JhaHospitalPage } from './jha-hospital.page';

const routes: Routes = [
  {
    path: '',
    component: JhaHospitalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JhaHospitalPage]
})
export class JhaHospitalPageModule {}
