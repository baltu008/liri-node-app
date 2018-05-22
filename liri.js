require("dotenv").config();
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var keys = require('./keys');
var request = require('request');
// fs is a core Node package for reading and writing files
var fs = require("fs");

var argument = process.argv[2];
var songArg = process.argv[3];
var movieArg = process.argv[3];

switch (argument) {
    case "my-tweets":
        var client = new Twitter(keys.twitter);
        var params = { screen_name: 'EccoSquatty' };
        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            if (!error) {
                for (var i = 0; i < tweets.length; i++) {
                    console.log(tweets[i].text);
                    console.log(tweets[i].created_at);
                }
            }
            console.log(error)
        });
        break;
    case "spotify-this-song":
        var spotify = new Spotify(keys.spotify);
        spotify.search({ type: 'track', query: songArg }, function (error, data) {
            if (error) {
                return console.log('Error occurred: ' + error);
            } else
                console.log(toTitleCase(`
                Song: ${songArg}`),
                    (`
                Artist: ${data.tracks.items[0].album.artists[0].name}
                Album: ${data.tracks.items[0].album.name}
                Preview: ${data.tracks.items[0].album.artists[0].external_urls.spotify}
                `));
        });
        break;
    case "movie-this":
        request("https://www.omdbapi.com/?t=" + movieArg + "&y=&plot=short&apikey=trilogy", function (error, body) {
            if (error) {
                return console.log('error:', + error);
            } else {
                var movieBody = JSON.parse(body.body);
                console.log(`Title: ${movieBody.Title}`);
                console.log(`Release Date: ${movieBody.Released}`);
                console.log(`IMDB Rating: ${movieBody.Ratings[0].Value}`);
                console.log(`RT Rating: ${movieBody.Ratings[1].Value}`);
                console.log(`Country: ${movieBody.Country}`);
                console.log(`Language: ${movieBody.Language}`);
                console.log(`Plot: ${movieBody.Plot}`);
                console.log(`Actors: ${movieBody.Actors}`);
            }
        });
        break;
    case "do-what-it-says":


        // This block of code will read from the "movies.txt" file.
        // It's important to include the "utf8" parameter or the code will provide stream data (garbage)
        // The code will store the contents of the reading inside the variable "data"
        fs.readFile("random.txt", "utf8", function (error, data) {

            // If the code experiences any errors it will log the error to the console.
            if (error) {
                return console.log(error);
            }

            // We will then print the contents of data
            console.log(data);

            // Then split it by commas (to make it more readable)
            var dataArr = data.split(",");

            // We will then re-display the content as an array for later use.
            console.log(dataArr);

        });

        break;
}

///Capitalize first letters of song argument on call-back
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}