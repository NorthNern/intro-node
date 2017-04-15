

var fs = require("fs");
// Grabs the api keys
var keys = require("./keys.js");
var Twitter = require("twitter");

// Gets all of the API keys from the keys file.
var myTwitterKeys = keys.twitterKeys;
var client = new Twitter({
  consumer_key: myTwitterKeys.consumer_key,
  consumer_secret: myTwitterKeys.consumer_secret,
  access_token_key: myTwitterKeys.access_token_key,
  access_token_secret: myTwitterKeys.access_token_secret
});
var spotify = require("spotify");
var request = require("request");

var randomTextArray = []; //for splitting the 'random.txt' into a liri command/input
var liriOutput = "";

var liriNodeCommand = process.argv[2];
var liriNodeInput = process.argv[3];

fs.appendFile("log.txt", liriNodeCommand, function(err) {
  if (err) {
    console.log(err);
  }
});
fs.appendFile("log.txt", ",", function(err) {
  if (err) {
    console.log(err);
  }
});
if (liriNodeInput !== undefined) {
  fs.appendFile("log.txt", liriNodeInput, function(err) {
    if (err) {
      console.log(err);
    }
  });
  fs.appendFile("log.txt", ",", function(err) {
    if (err) {
      console.log(err);
    }
  });
}


function liriBot(liriCommand,liriInput) {
  liriOutput = "";
  if (liriCommand === "my-tweets") {
    client.get('statuses/home_timeline', function(error, tweets, response) {
      // console.log(tweets);
      for (var i=0; i < tweets.length; i++) {
        liriOutput += (tweets[i].text + "," + tweets[i].created_at + ",");
        console.log(tweets[i].text);
        console.log(tweets[i].created_at);      
      }
      fs.appendFile("log.txt", liriOutput, function(err) {
        if (err) {
          console.log(err);
        }
      });
    });
  }
  else if (liriCommand === "spotify-this-song") {
    liriOutput = "";
    spotify.search({ type: 'track', query: liriInput}, function(err, data) {
      if ( err ) {
          console.log('Error occurred: ' + err);
          return;
      }
      var spotifySong = data.tracks.items[0]
      if (spotifySong === undefined) {
        console.log("Sorry, I could not find anything.")
      }
      else {
        for (var i = 0; i < spotifySong.artists.length; i++) {
          console.log("Artist(s): " + spotifySong.artists[i].name);  //Artist(s)
          liriOutput += (spotifySong.artists[i].name + ",")
        }
        console.log("Name: " + spotifySong.name); //The song's name
        console.log("Preview: " + spotifySong.preview_url);  //A preview link of the song from Spotify
        console.log("Album: " + spotifySong.album.name);  //The album that the song is from
        liriOutput += (spotifySong.name + "," + spotifySong.preview_url + "," + spotifySong.album.name + ",");
      }
    });
    fs.appendFile("log.txt", liriOutput, function(err) {
      if (err) {
        console.log(err);
      }
    });  
  }
  else if (liriCommand === "movie-this") {
    liriOutput = "";
    var queryUrl = "http://www.omdbapi.com/?t=" + liriInput + "&y=&plot=short&r=json";
    request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      if (JSON.parse(body).Response === "False") {
        console.log("Sorry, I could not find anything.")
      }
      else {
      // console.log(body);
        console.log(JSON.parse(body).Title);
        console.log(JSON.parse(body).Year);
        console.log(JSON.parse(body).imdbRating);
        console.log(JSON.parse(body).Country);
        console.log(JSON.parse(body).Language);
        console.log(JSON.parse(body).Plot);
        console.log(JSON.parse(body).Actors);
        console.log(JSON.parse(body).Website);
        liriOutput += (JSON.parse(body).Title + "," + JSON.parse(body).Year + "," + JSON.parse(body).imdbRating + "," + JSON.parse(body).Country + "," 
          + JSON.parse(body).Language + "," + JSON.parse(body).Plot + "," + JSON.parse(body).Actors + "," + JSON.parse(body).Website + ",");
        fs.appendFile("log.txt", liriOutput, function(err) {
          if (err) {
          console.log(err);
          }
        }); 
      }
    }

    });
  }
}

if (liriNodeCommand ==="my-tweets"){
  liriBot(liriNodeCommand);
}
else if (liriNodeCommand ==="spotify-this-song") {
  if (liriNodeInput === undefined) {
      liriNodeInput = "the sign ace of base";//the sign by ace of base;
    }
    else {
      for (var i = 4; i<process.argv.length; i++){
        liriNodeInput += " " + process.argv[i];
      }
    }
  liriBot(liriNodeCommand,liriNodeInput);
}
else if (liriNodeCommand === "movie-this") {
  if (liriNodeInput === undefined) {
      liriNodeInput = "Mr.+Nobody";
    }
  else {
    for (var i = 4; i<process.argv.length; i++){
      liriNodeInput += "+" + process.argv[i];
    }
  }
  liriBot(liriNodeCommand,liriNodeInput);
}
else if (liriNodeCommand === "do-what-it-says") {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (data === undefined){
      console.log("Sorry, there is nothing here for me to do.");
    } 
    else {
    randomTextArray = data.split(",")
    }
  liriBot(randomTextArray[0],randomTextArray[1]);
  });
}
else {
  console.log("Error:  My only functions are my-tweets, spotify-this-song, movie-this, or do-what-it-says.  Please don't try and use me for...that.")
}
