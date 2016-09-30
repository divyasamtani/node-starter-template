
module.exports = function(app, io) {

  var module = {}; // this is the object that we're going to explore
  var mySocket = null;

//exporting the send tweet function
  module.sendTweet = function(tweet) {

    if(!mySocket){
      return
    };

    mySocket.emit('tweet', tweet);
  }

//connection = new visitor, intiialize that conneciton with the client. socket.emit means we are creating an event that the client can listen to

  io.on('connection', function (socket) {
    mySocket = socket;

  });

    return module;
  }




