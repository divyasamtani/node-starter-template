var map = null;

  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 0, lng: 0},
      zoom: 2
    });
}

document.addEventListener("DOMContentLoaded", function(event){ //when its loaded everything, this event fires

  var socket = io.connect('http://localhost:3000'); //Connects socket to localhost

  socket.on('tweet', function (tweet) { // on event news, take data we are getting and print it
    console.log(tweet); //logging it to the browser

    if(!map){
      return;
    }

    var position = {
      lat: tweet.place.bounding_box.coordinates[0][0][1],
      lng: tweet.place.bounding_box.coordinates[0][0][0]
    };

    // Create a new marker

    var marker = new google.maps.Marker ({
      position: position,
      map: map,
      title: 'tweet.text'
    });
  });
})


