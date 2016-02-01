// Constants
var MAP_CENTER = {lat:38.6272222, lng:-90.1977778};
var FS_CLIENT_ID = "PIP03QKRLW4OYD4WN2KYU3D2E3B5MG44OUEEN4L2QBNFSZXU";
var FS_CLIENT_SECRET = "GA1PBLEZQFEIWFF5GYXLY0IJC1DBLJSBRAUPBDOP2JTQIY3L";
var FS_VERSION = "20160131";

// Global Variables
var sites = [
  {name:"Gateway Arch", latLng:{lat:38.6246910, lng:-90.1847763}, id:"ChIJteVBdWDwwIcRNKiWxoko7Xk", venue:"4acbc3fbf964a52013c620e3"},
  {name:"Busch Stadium", latLng:{lat:38.6226188, lng:-90.1928209}, id:"ChIJF88LRBuz2IcRJ59Q49dieaU", venue:"4b155059f964a5206ab023e3"},
  {name:"Missouri Botanical Garden", latLng:{lat:38.6127672, lng:-90.2593798}, id:"ChIJgc3Sqf-02IcRgFDe_IDFsGA", venue:"4acbc3fbf964a5202ec620e3"},
  {name:"Saint Louis Zoo", latLng:{lat:38.6350068, lng:-90.2907165}, id:"ChIJLQYEzFy12IcRMOjolwEIdWA", venue:"4acbc3fbf964a52024c620e3"},
  {name:"Fabulous Fox Theater", latLng:{lat:38.639003, lng:-90.232133}, id:"ChIJdVbZ8KS02IcRvTYPK1y3gFU", venue:"4acbc3fdf964a5201ec720e3"}
];

var mapDiv = document.getElementById("map-content");

//var contentString = '<div id="content"><h3>name</h3><span>address</span><br><span>phone</span><br><a href="url">url</a><p>description</p></div>';
var contentString = '<div id="content"><div class="row"><h3>name</h3></div><div class="row"><div class="col-xs-4"><img src="fssrc" alt="Foursquare provided image"></div><div class="col-xs-8"><span>address</span><br><span>phone</span><br><a href="fsurl">fsurl</a></div></div><div class="row"><p>description</p></div><div class="row"><span>Rating: fsrating / 10</span></div></div>';
var ViewModel = function() {
  var self = this;
  
  self.googleMap = new google.maps.Map(mapDiv, {
    center: MAP_CENTER,
    zoom: 13
  });
  
  self.infowindow = new google.maps.InfoWindow();
  self.googlePlaces = new google.maps.places.PlacesService(self.googleMap);

  self.allPlaces = [];
  sites.forEach(function(place) {
    self.allPlaces.push(new Place(place));
  });
  
  self.allPlaces.forEach(function(place){
    var markerOptions = {
      map: self.googleMap,
      position: place.latLng,
      placeId: place.id,
      venue: place.venue,
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
    this.venue = dataObj.venue;
    this.marker = null;
  }
  
  function activateLocation() {  
    var currentMarker = this;
    // Clear any animated markers and toggle the clicked marker's animation
    self.allPlaces.forEach(function(place){
      place.marker.setAnimation(null);
    });
	  
    this.setAnimation(google.maps.Animation.BOUNCE);

    //make ajax call to four square for additional information
    //https://api.foursquare.com/v2/venues/4acbc3fbf964a52013c620e3
    var fsInfo = $.ajax({
      url: 'https://api.foursquare.com/v2/venues/' + this.venue,
      dataType: 'json',
      data: 'client_id=' + FS_CLIENT_ID + '&client_secret='+ FS_CLIENT_SECRET + '&v=' + FS_VERSION,
      success: function(data) {
	var venue = data.response.venue;
	var content = contentString;
  	content = content.replace("fssrc", venue.bestPhoto.prefix + "125x125" + venue.bestPhoto.suffix);
	content = content.replace("name", venue.name);
  	content = content.replace("address", venue.location.formattedAddress.join("<br/>"));
  	content = content.replace("phone", venue.contact.formattedPhone);
	content = content.replace("description", venue.description);
	content = content.replace("fsrating", venue.rating);
	content = content.replace(/fsurl/g, venue.url);
	self.infowindow.setContent(content);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        self.infowindow.setContent('Foursquare information is not available.')		
      },
      complete: function(jqXHR, textStatus) {
      	self.infowindow.open(self.googleMap, currentMarker);
      }
    });

  }
};

ko.applyBindings(new ViewModel());
