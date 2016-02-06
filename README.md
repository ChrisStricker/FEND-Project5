Project5 - Neighborhood Map
===========================

This project takes at least five locations local to the developer and displays them on a map.  The goal of this this project demonstrates how to use frameworks and ajax to present a dynamic experience to the end user.  Knockout.js was required, as well as the Google Maps API.  I decided to go with the Foursquare API as an additional third-party API.

How To Use
==========
You can access the website at this url: http://chrisstricker.github.io/FEND-Project5/map.html or clone the repository locally and load the map.html file into a browser.

The page displays a map of the St. Louis area, along with a couple places to see while in the city, designated by the markers.  If you click on a marker or on the location in the list, a request for more information will be sent to the Foursquare API.  When the API responds, the clicked marker will display the name of the location, along with the address, phone number, url, a description (if available) and a rating.

There is a filter at the top of the page that will hide places and markers based on what is typed in the filter.
