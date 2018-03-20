import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, LoadingController, ToastController } from 'ionic-angular';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { SetLocationPage } from '../set-location/set-location';
import { Location } from '../../models/location';
import { PlacesService } from '../../services/places.service';




@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {
  geolocationOptions : GeolocationOptions;
  currentPosition : Geoposition;

  location:Location = {lat:36.731470384526965, lan:10.210593179614534};
  locationIsSet:boolean = false;
  imageUrl:string = '';

  constructor(private modalCtrl:ModalController,
              private geolocation: Geolocation,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private camera: Camera,
              private placesService: PlacesService,
            ) {
  }

  onSubmit(form:NgForm){
    console.log(form.value);
    let f = form.value;
    this.placesService.addPlace(f.title,f.description,this.location,this.imageUrl);
    form.reset();
    this.initModel();
  }

  initModel(){
    this.location = {lat:36.731470384526965, lan:10.210593179614534};
    this.locationIsSet = false;
    this.imageUrl = '';
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

    this.geolocationOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
    this.geolocation.getCurrentPosition(this.geolocationOptions)
    .then((resp:Geoposition) => {
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

  onTakePhoto(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.imageUrl = base64Image;
    }, (err) => {
     alert(err);
    });
  }

}
