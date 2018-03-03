import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, LoadingController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

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
              private geolocation: Geolocation,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
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

  onLocate(){
    let loader = this.loadingCtrl.create({
      content: "Getting your location..."
    });
    loader.present();

    this.geolocation.getCurrentPosition()
    .then((resp) => {
        loader.dismiss();
        this.location.lat = resp.coords.latitude;
        this.location.lan = resp.coords.longitude;
        this.locationIsSet = true;
     })
     .catch((error) => {
        loader.dismiss();
        console.log('Error getting location', error);
        let toast = this.toastCtrl.create({
          message: 'Couldn\'t get location, please pick it manually',
          duration: 1500
        });
        toast.present();        
     });
  }

}
