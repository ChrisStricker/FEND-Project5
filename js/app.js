// Constants
var MAP_CENTER = {lat:38.6272222, lng:-90.1977778};

// Global Variables
var sites = [
  {name:"Gateway Arch", latLng:{lat:38.6246910, lng:-90.1847763}, id:"ChIJteVBdWDwwIcRNKiWxoko7Xk"},
  {name:"Busch Stadium", latLng:{lat:38.6226188, lng:-90.1928209}, id:"ChIJF88LRBuz2IcRJ59Q49dieaU"},
  {name:"Missouri Botanical Garden", latLng:{lat:38.6127672, lng:-90.2593798}, id:"ChIJgc3Sqf-02IcRgFDe_IDFsGA"},
  {name:"Saint Louis Zoo", latLng:{lat:38.6350068, lng:-90.2907165}, id:"ChIJLQYEzFy12IcRMOjolwEIdWA"},
  {name:"Fabulous Fox Theater", latLng:{lat:38.639003, lng:-90.232133}, id:"ChIJdVbZ8KS02IcRvTYPK1y3gFU"}
];

var mapDiv = document.getElementById("map-content");

var contentString = '<div id="content"></div>';

var ViewModel = function() {
  var self = this;
  
  self.googleMap = new google.maps.Map(mapDiv, {
    center: MAP_CENTER,
    zoom: 13
  });
  
  self.allPlaces = [];
  sites.forEach(function(place) {
    self.allPlaces.push(new Place(place));
  });
  
  self.allPlaces.forEach(function(place){
    var markerOptions = {
      map: self.googleMap,
      position: place.latLng,
      placeId: place.id,
      animation: google.maps.Animation.DROP
    };
    
    place.marker = new google.maps.Marker(markerOptions);
    place.marker.addListener('click', activateLocation);
    // You might also add listeners onto the marker, such as "click" listeners.
  });
  
  self.visiblePlaces = ko.observableArray();
  
  self.allPlaces.forEach(function(place){
    self.visiblePlaces.push(place);
  });
  
  self.userInput = ko.observable('');
  
  self.filterMarkers = function() {
    var searchInput = self.userInput().toLowerCase();
    self.visiblePlaces.removeAll();
    
    self.allPlaces.forEach(function(place) {
      place.marker.setVisible(false);
      if (place.locationName.toLowerCase().indexOf(searchInput) !== -1) {
        self.visiblePlaces.push(place);
      }
    });
    self.visiblePlaces().forEach(function(place){
      place.marker.setVisible(true);
    });
  };
  
  function Place(dataObj) {
    this.locationName = dataObj.name;
    this.latLng = dataObj.latLng;
    this.id = dataObj.id;
    this.marker = null;
  }
  
  function activateLocation() {  
    // Clear any animated markers and toggle the clicked marker's animation
    self.allPlaces.forEach(function(place){
      place.marker.setAnimation(null);
    });
	  
    this.setAnimation(google.maps.Animation.BOUNCE);
	  
    // Open the info window
    $.getJSON( "https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyBN6fQCYN1L14ie8uTENpNZCCe9BPxPRbc&placeid=" + this.placeId + "&callback=?", function( data ) {
      var items = [];
      $.each( data, function( key, val ) {
        items.push( "<li id='" + key + "'>" + val + "</li>" );
      });
    });
  }
};

ko.applyBindings(new ViewModel());
