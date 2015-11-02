// Constants
var MAP_CENTER = {lat:38.6272222, lng:-90.1977778};

// Global Variables
var sites = [
	{name:"Gateway Arch", latLng:{lat:38.624674, lng:-90.184941}},
	{name:"Busch Stadium", latLng:{lat:38.622644, lng:-90.192812}},
	{name:"Missouri Botanical Garden", latLng:{lat:38.612008, lng:-90.260196}},
	{name:"St. Louis Zoo", latLng:{lat:38.63578, lng:-90.288734}},
	{name:"Fabulous Fox Theater", latLng:{lat:38.639003, lng:-90.232133}}
];

var ViewModel = function() {
  var self = this;
  
  self.googleMap = new google.maps.Map(document.getElementById('map'), {
    center: MAP_CENTER,
    zoom: 13
  });
  
  self.allPlaces = [];
  locationData.forEach(function(place) {
    self.allPlaces.push(new Place(place));
  });
  
  self.allPlaces.forEach(function(place){
    var markerOptions = {
      map: self.googleMap,
      position: place.latLng
    };
    
    place.marker = new google.maps.Marker(markerOptions);
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
    this.marker = null;
  }
};

ko.applyBindings(new ViewModel());
