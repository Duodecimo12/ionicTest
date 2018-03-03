import { Component } from '@angular/core';

import { AddPlacePage } from '../add-place/add-place';
import { PlacesService } from '../../services/places.service';
import { Place } from '../../models/place';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  addPlacePage:any = AddPlacePage;
  places: Place[] = [];
  
  constructor(private placesService:PlacesService) {

  }

  onOpenPlace(){
    
  }

  ionViewWillEnter(){
    this.places = this.placesService.loadPlaces();
  }
}
