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
        if (!songArg) {
            songArg = "The Sign Ace of Base"
        }
        spotifyTxt(songArg);
        break;
    case "movie-this":
        if (!movieArg) {
            console.log("If you haven't watched 'Mr. Nobody,' then you should: <http://www.imdb.com/title/tt0485947/>")
            console.log("It's on Netflix!")
            movieArg = "Mr. Nobody"
        }
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
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (error) {
                return console.log(error);
            }

            console.log(data);

            var dataArr = data.split(",");
            spotifyTxt(dataArr[1]);

        });

        break;
}
function spotifyTxt(songArg) {
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

    })
}

///Capitalize first letters of song argument on call-back
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}