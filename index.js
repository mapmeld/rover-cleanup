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
  client.get('search/tweets', {q: 'RobotTest2'}, function(error, coded, response){
    var tweets = coded.statuses;
    var gj = {
      type: 'FeatureCollection',
      features: []
    };
    for (var t = 0; t < tweets.length; t++) {
      if (tweets[t].coordinates) {
        gj.features.push({
          type: 'Feature',
          properties: {
            userid: tweets[t].user.id_str,
            username: tweets[t].user.name,
            usertweet: tweets[t].user.screen_name
          },
          geometry: tweets[t].coordinates
        });
      }
    }
    res.json(gj);
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log('ready');
});
