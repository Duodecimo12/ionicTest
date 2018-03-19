import {Place} from "../models/place";
import { Location } from "../models/location";

export class PlacesService{
    private places: Place[]=[];

    addPlace(title: string, description:string, location:Location, imageUrl:string){
        console.log('addPlace');
        let place = new Place(title,description,location,imageUrl);
        this.places.push(place);
    }

    loadPlaces(){
        console.log("loadPlaces");
        return this.places.slice();
    }

    deletePlace(index:number){
        console.log("deletePlace");
        this.places.splice(index,1);
    }
}