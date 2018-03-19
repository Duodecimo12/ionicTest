import { Component } from '@angular/core';

import { AddPlacePage } from '../add-place/add-place';
import { PlacesService } from '../../services/places.service';
import { Place } from '../../models/place';
import { ModalController } from 'ionic-angular';
import { PlacePage } from '../place/place';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  addPlacePage:any = AddPlacePage;
  places: Place[] = [];
  
  constructor(private placesService:PlacesService,
              private modalCtrl:ModalController) {

  }

  onOpenPlace(place:Place,i:number){
    let modal = this.modalCtrl.create(PlacePage,{place,i});
    modal.present();
    modal.onDidDismiss(data => {
      if(data)
        this.places = this.placesService.loadPlaces();
    });
       
  }

  ionViewWillEnter(){
    this.places = this.placesService.loadPlaces();
  }
}
