import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, LoadingController, ToastController } from 'ionic-angular';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { SetLocationPage } from '../set-location/set-location';
import { Location } from '../../models/location';
import { PlacesService } from '../../services/places.service';
import { LocationAccuracy } from '@ionic-native/location-accuracy';




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
              private locationAccuracy: LocationAccuracy,
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

    this.locationAccuracy.canRequest().then((canRequest: boolean) => {

      if(canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {
            //alert('Request successful');
            this.getLocation();            
          },
          error => {            
            alert('Please activate your GPS');
          }
        );
      }
    
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
      //alert(JSON.stringify(err) );
      alert("Error when saving picture...");
    });

  }

  getLocation(){

    let loader = this.loadingCtrl.create({
      content: "Getting your location..."
    });
    loader.present();

    this.geolocationOptions = {
      timeout:20000,
      enableHighAccuracy:false,
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
        // alert(JSON.stringify(error))
        let message;
        switch(error.code) { 
          case 1: { 
            //PERMISSION_DENIED
            message = "The page didn't have the permission to do geolocation"; 
            break; 
          }
          case 2: {
            //POSITION_UNAVAILABLE
            message = "The geolocation failed! Try again...";
            break; 
          }
          case 3: {
            //Timeout
            message = "Your device is very slow! Please Try again...";
            break; 
          }
          default: { 
            message = "Error while trying to get your location";
            break;
          }
        }
        alert(message);
        if(error.code == 2)
          this.onLocate();

        let toast = this.toastCtrl.create({
          message: 'Couldn\'t get location, please pick it manually',
          duration: 3000,
        });
        toast.present();        
     });    

  }

}
