require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");

var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret
});

var searchTerm = "";
if (process.argv[3]) {
    for (let i = 3; i < process.argv.length; i++) {
      if (searchTerm == "") {
        searchTerm = process.argv[i];
      } else {
        searchTerm += "+" + process.argv[i];
      }
    }
}

/*
 * `"https://rest.bandsintown.com/artists/"
 * + artist
 * + "/events?app_id=codingbootcamp"`
 *
 *
 *
 *
 *
 */

function liriCommands(command) {
  switch (command) {
    case "movie-this":
      omdbSearch(searchTerm);
      break;
    case "concert-this":
      bandSearch(searchTerm);
      break;
    case "spotify-this-song":
      songSearch(searchTerm);
      break;
    case "do-what-it-says":
      break;

    default:
      break;
  }
}

function omdbSearch(search) {
  var movieName = "";
  if (search !== "") {
    movieName = search;
  } else {
    movieName = "Mr.+Nobody";
  }
  // Then run a request with axios to the OMDB API with the movie specified
  var queryUrl =
    "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  // This line is just to help us debug against the actual URL.
  console.log(queryUrl);

  // Then create a request with axios to the queryUrl
  axios
    .get(queryUrl)
    .then(function(response) {
      // If the request with axios is successful
      // ...
      console.log(response.data);
    })
    .catch(function(err) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("Error", err.message);
      }
      console.log(err.config);
    });
}

function bandSearch(search) {
  var bandName = "";
  if (search !== "") {
    bandName = search;
  } else {
    bandName = "Muse";
  }

  var queryUrl =
    "https://rest.bandsintown.com/artists/" +
    bandName +
    "/events?app_id=codingbootcamp";

  axios
    .get(queryUrl)
    .then(function(response) {
      // If the request with axios is successful
      // ...
      console.log(response.data);
    })
    .catch(function(err) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("Error", err.message);
      }
      console.log(err.config);
    });
}

function songSearch(search) {
  var songName = "";
  if (search !== "") {
    songName = search;
  } else {
    songName = "Stairway+to+Heaven";
  }

  spotify.search({ type: "track", query: songName }, function(
    err,
    data
  ) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    console.log("\nSong: " + data.tracks.items[0].name);
    console.log("Album: " + data.tracks.items[0].album.name);
    console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
    console.log("Preview URL: " + data.tracks.items[0].preview_url);
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  });
}

function randomAct(){

}


liriCommands(process.argv[2]);
