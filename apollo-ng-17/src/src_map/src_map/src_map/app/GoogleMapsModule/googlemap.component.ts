import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-googlemap',
  templateUrl: './googlemap.component.html',
  imports: [GoogleMapsModule],
})
export class GooglemapComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('googleMap') googleMapElement: any;  // Reference to the map in HTML

  display: any;
  center: google.maps.LatLngLiteral = {lat: 24, lng: 12};
  zoom = 4;
  marker: google.maps.Marker | null = null;  // Marker object reference
  map!: google.maps.Map;  // Google map instance
  watchId: number | null = null; // Store the watch position ID for clearing later

  constructor() {}

  ngOnInit(): void {
    this.getLiveLocation(); // Start watching the live location on component init
  }

  ngAfterViewInit() {
    this.initMap();  // Initialize the map after view is fully loaded
  }

  // Initialize the map with reference from ViewChild
  initMap() {
    console.log("Initializing the map...");

    this.map = new google.maps.Map(this.googleMapElement.nativeElement, {
      center: this.center,
      zoom: this.zoom
    });

    // Check if the map is correctly initialized
    if (this.map) {
      console.log("Map initialized successfully.");
    } else {
      console.error("Map initialization failed.");
    }
  }

  // This method starts watching the device's live location
  getLiveLocation() {
    console.log("Starting to watch the live location...");

    if (navigator.geolocation) {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.center = { lat, lng }; // Update the center with the new location
          this.zoom = 15; // Adjust zoom level for a detailed view

          console.log(`Current live location: Lat: ${lat}, Lng: ${lng}`);

          // Update the marker position as the device moves
          this.updateMarker(lat, lng);

          // Center the map to the new live location
          this.map.panTo(new google.maps.LatLng(lat, lng));
        },
        (error) => {
          console.error("Error retrieving live location: ", error);
          alert("Geolocation is not supported by this browser or location access was denied.");
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  // This method updates the marker's position at the new location
  updateMarker(lat: number, lng: number) {
    if (this.marker) {
      // If a marker already exists, update its position
      console.log("Updating the marker position...");
      this.marker.setPosition(new google.maps.LatLng(lat, lng));
    } else {
      // If no marker exists, create a new one
      console.log("Creating a new marker for live location...");
      this.marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map,  // Add the marker to the map
        title: "Your Live Location"
      });
    }
  }

  // This function is for moving the map when clicked
  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

  // This function updates the latitude and longitude as the mouse moves over the map
  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  // Stop watching the live location when the component is destroyed
  ngOnDestroy() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      console.log("Stopped watching the live location.");
    }
  }
}
