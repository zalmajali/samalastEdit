import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NumbersdirectoryshopPageRoutingModule } from './numbersdirectoryshop-routing.module';

import { NumbersdirectoryshopPage } from './numbersdirectoryshop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NumbersdirectoryshopPageRoutingModule
  ],
  declarations: [NumbersdirectoryshopPage]
})
export class NumbersdirectoryshopPageModule {}
