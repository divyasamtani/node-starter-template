var Twitter = require('twitter');

module.exports = function (app, passport, socketio) {

  function isLoggedIn(req, res, next) {

    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect('/')
    }

// All Twitter related routes in the Twitter controller

  // Twitter Login
  app.get('/auth/twitter', passport.authenticate('twitter'));

  // Twitter Callback
  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect : '/secret',
    failureRedirect : '/login',
    failureFlash: true
  }));


    app.get('/twitter', isLoggedIn, function(req, res){
     res.render('twitter', {message: req.flash('loginMessage') });
  });

    app.post('/twitter', isLoggedIn, function(req, res){

      var tweet = req.body.tweet;

      console.log(tweet);

      var client = new Twitter({
        consumer_key: 'kwOL7cNGEEjqRwEA6mUyc6Ml1',
        consumer_secret: 'yygmOzKXTjkxInG1UWDLwes2ZhlfYTdqGxvyREcNxVYRqvHm5P',
        access_token_key: req.user.twitter.token,
        access_token_secret: req.user.twitter.secret,
      });

      // Post to Twitter
      client.post('statuses/update', {status: tweet},  function(error, tweet, response) {
        if(error) console.log(error);
          // console.log(response);  // Raw response object.
        res.json('success, tweet has been posted');

      });
  });

  app.get('/twitter/timeline', isLoggedIn, function(req, res){

      var client = new Twitter({
        consumer_key: 'kwOL7cNGEEjqRwEA6mUyc6Ml1',
        consumer_secret: 'yygmOzKXTjkxInG1UWDLwes2ZhlfYTdqGxvyREcNxVYRqvHm5P',
        access_token_key: req.user.twitter.token,
        access_token_secret: req.user.twitter.secret,
      });

  client.get('statuses/home_timeline', function(error, tweet, response) {
        if(error) console.log(error);
        res.json(tweet);
      });
  });


  // Create new back end to get the tweets

  app.get('/twitter/map', isLoggedIn, function(req, res){
     res.render('map', {message: req.flash('loginMessage') });
  });


    app.get('/twitter/map/markers', isLoggedIn, function(req, res){

     var client = new Twitter({
          consumer_key: 'kwOL7cNGEEjqRwEA6mUyc6Ml1',
          consumer_secret: 'yygmOzKXTjkxInG1UWDLwes2ZhlfYTdqGxvyREcNxVYRqvHm5P',
          access_token_key: req.user.twitter.token,
          access_token_secret: req.user.twitter.secret,
        });

    client.get('geo/search', {'query':"usa"}, function(error, tweet, response) {
        if(error) console.log(error);
        res.json(tweet);
      });
  });


// THE MAP

 app.get('/map', function(req, res) {
    res.render('map', {}); //render function needs an object, hence the empty object
 });


// in this case we are not going to connect. just have a stream of data coming in

  var client = new Twitter({
      consumer_key: 'kwOL7cNGEEjqRwEA6mUyc6Ml1',
      consumer_secret: 'yygmOzKXTjkxInG1UWDLwes2ZhlfYTdqGxvyREcNxVYRqvHm5P',
      access_token_key: '407746091-J4Mri2FhBXcMwMR5kNcfePvyw3dZnXy03cK4mjYM',
      access_token_secret: 'maD6pMwTS6OeSzaQ5ntYCsI8f7pNRtk42MsuApfJoJ2Zv',
  });

  var hongkong = '113.719482,22.560123,114.500885,22.137168';
  var theWorld = "-180,-90,180,90";
  client.stream('statuses/filter', {'locations': theWorld},  function(stream) {
    stream.on('data', function(tweet) {
      socketio.sendTweet(tweet);
    });

    stream.on('error', function(error) {
      console.log(error);
    });
  });

}