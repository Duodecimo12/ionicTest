import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Place } from '../../models/place';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'page-place',
  templateUrl: 'place.html',
})
export class PlacePage {
  place:Place;
  index:number;
  deleted:boolean = false;

  constructor(private navParams: NavParams,
              private viewCtrl: ViewController,
              private placesService: PlacesService) {
    this.place = this.navParams.get('place');
    this.index = this.navParams.get("i");
  }

  onLeave(){
    this.viewCtrl.dismiss(this.deleted);
  }

  onDelete(){
    this.placesService.deletePlace(this.index);
    this.deleted = true;
    this.onLeave();
  }

}
