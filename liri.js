/**
 * LIRI Node Command Line App
 * 
 * @author Garret Rueckert
 * 
 * UofU Bootcamp January 2019
 */


//Global Variables/ Node dependencies
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");
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

/**
 * Calls one of the search functions based on what user passes
 * to it in the command line. Process.argv[2] will be used then 
 * all arguments past that will format to the search.
 * 
 * @param command Command to pass LIRI; possible commands are:
 * 'movie-this' 'concert-this' 'spotify-this-song' and 
 * 'do-what-it-says'
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
      randomAct();
      break;
    default:
      console.log("I know 'movie-this', 'concert-this'," +
      " 'spotify-this-song', or 'do-what-it-says' for commands.");
      break;
  }
}

/**
 * Hits the OMBD API to print relevant movie info to the 
 * console based on the search passed to it
 * 
 * @param search Movie title to search for
 */
function omdbSearch(search) {
  var movieName = "";
  if (search !== "") {
    movieName = search;
  } else {
    movieName = "Mr.+Nobody";
  }
  var queryUrl =
    "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  // Then create a request with axios to the queryUrl
  axios
    .get(queryUrl)
    .then(function(response) {
      // If the request with axios is successful
      console.log("\nTitle: "+response.data.Title);
      console.log("Year: "+response.data.Year);
      console.log("IMDB Rating: "+response.data.imdbRating);
      console.log("Rotten Tomatoes Rating: "+response.data.Ratings[1].Value);
      console.log("Country: "+response.data.Country);
      console.log("Language:c"+response.data.Language);
      console.log("Plot:\n"+response.data.Plot);
      console.log("Actors: "+response.data.Actors);
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
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

/**
 * Hits the BandsInTown API and prints concert info
 * for whatever artist/band searched for to the console
 * 
 * @param search Band to search for upcoming concerts for
 */
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
      console.log("\nVenue: " + response.data[0].venue.name);
      console.log("Location: " + response.data[0].venue.city 
        + ", " + response.data[0].venue.country);
      console.log(moment(response.data[0].datetime).format("M/D/YYYY"));
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
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

/**
 * Hits the Spotify API with the @search passed to it 
 * and prints the song info to the console
 * 
 * @param search Song to search for
 */
function songSearch(search) {
  var songName = "";
  if (search !== "") {
    songName = search;
  } else {
    songName = "The+Sign+Ace+of+Base";
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
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  });
}

/**
 * Reads random.txt and does whatever LIRI command is 
 * written there (formatted by a comma)
 */
function randomAct(){
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }

    console.log(data);
    var dataArr = data.split(',');
    searchTerm = dataArr[1];
    liriCommands(dataArr[0]);
  });
}


liriCommands(process.argv[2]);
