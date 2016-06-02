

// Reference to the Firebase database.
var firebase = new Firebase("https://issgooglemap.firebaseio.com");


function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: myData.iss_position['latitude'], lng: myData.iss_position['longitude']},
    zoom: 4
  });

  // Add marker on user click
  map.addListener('click', function(e) {
    firebase.push({lat: e.latLng.lat(), lng: e.latLng.lng()});
  });

  firebase.on("child_added", function(snapshot, prevChildKey) {
    // Get latitude and longitude from the cloud.
    var newPosition = snapshot.val();

    // Create a google.maps.LatLng object for the position of the marker.
    // A LatLng object literal (as above) could be used, but the heatmap
    // in the next step requires a google.maps.LatLng object.
    var latLng = new google.maps.LatLng(newPosition.lat, newPosition.lng);

    // Place a marker at that location.
    var marker = new google.maps.Marker({
      position: latLng,
      map: map
    });
  });
}
$('document').ready(function(){

var doStuff = function() {
 $.ajax({
      type: "GET",
      url: "http://api.open-notify.org/iss-now.json",
      dataType: "jsonp",
      success: function (data) {
         console.log('do stuff is being called');
         myData = data;
         firebase.push({lat: myData.iss_position['latitude'], lng: myData.iss_position['longitude']});
         initMap();
         // return myData;
      },
  });
}

var intervalId = setInterval(doStuff, 6000);

 $('#displayruns').on('click', function(e){
  e.preventDefault();
  console.log(myData);
  firebase.push({lat: myData.iss_position['latitude'], lng: myData.iss_position['longitude']});
   $.ajax({
      type: "GET",
      url: "http://api.open-notify.org/iss-now.json",
      dataType: "jsonp",
      success: function (data) {
         console.log(data.iss_position);
         myData = data;
         return myData;
      },
  });
  initMap();
 })


});