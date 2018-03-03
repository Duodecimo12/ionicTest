import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from 'ionic-angular';
import { SetLocationPage } from '../set-location/set-location';
import { Location } from '../../models/location';

@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {
  location:Location = {lat:36.731470384526965, lan:10.210593179614534};
  locationIsSet:boolean = false;

  constructor(private modalCtrl:ModalController,
              ) {
  }

  onSubmit(form:NgForm){
    console.log(form.value);
  }

  onOpenMap(){
    let modal = this.modalCtrl.create(SetLocationPage,{ location:this.location,isSet:this.locationIsSet } );
    modal.present();
    modal.onDidDismiss(data=>{
      if(data){
        this.location = data.location;
        this.locationIsSet = true;
      }
      
      //console.log(data);
    })
  }

}
