const express = require('express');

const Twitter = require('twitter');

var app = express();

app.use(express.static('static'));

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

app.get('/', function (req, res) {
  res.redirect('/map.html');
});

app.get('/data', function (req, res) {
  client.get('search/tweets', {q: 'rovercleanup'}, function(error, coded, response){
    var tweets = coded.statuses;
    var gj = {
      type: 'FeatureCollection',
      features: []
    };
    for (var t = 0; t < tweets.length; t++) {
      var tweet = tweets[t];
      var user = tweet.user;
      var photo = [];
      if (tweet.entities && tweet.entities.media && tweet.entities.media.length) {
        for (var m = 0; m < tweet.entities.media.length; m++) {
          var mediaURL = tweet.entities.media[m].media_url.split('http:')[1];
          if (tweet.entities.media[m].sizes.large.h > tweet.entities.media[m].sizes.large.w) {
            mediaURL += "?tall";
          }
          photo.push(mediaURL);
        }
      }
      if (tweet.coordinates) {
        gj.features.push({
          type: 'Feature',
          properties: {
            text: tweet.text,
            photo: photo,
            userid: user.id_str,
            username: user.name,
            usertweet: user.screen_name
          },
          geometry: tweet.coordinates
        });
      }
    }
    res.json(gj);
  });
});

app.get('/test-tweet', function (req, res) {
  client.get('search/tweets', {q: 'rovercleanup'}, function(error, coded, response){
    var tweets = coded.statuses;
    res.json(tweets);
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log('ready');
});
