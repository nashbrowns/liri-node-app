const dotenv = require("dotenv").config();
const keys = require("./key.js");
const Spotify = require('node-spotify-api');
const axios = require("axios");

if (dotenv.error) {
    throw dotenv.error
}

const command = process.argv[2];
const commandString = process.argv[3];

if (command === 'movie-this') {

    callOMBD(commandString);
}
else if (command === 'spotify-this-song') {

    callSpotify(commandString);
}
else {
    console.log('invalid command');
    console.log('valid commands: ');
    console.log("movie-this '<movie title here>' ");
    console.log("spotify-this-song '<song name here>' ");
    console.log("concert-this '<artist/band name here>' ");
    console.log('');
}

function callOMBD(movieName) {

    const omdb_id = dotenv.parsed.OMDB_ID;

    axios.get("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=" + omdb_id)
        .then(function (response) {

            let data = response.data;
            let Ratings = [];

            /* console.log(JSON.stringify(data)); */

            for (let i = 0; i < data.Ratings.length; i++) {
                Ratings.push(data.Ratings[i].Source + ': ' + data.Ratings[i].Value);
            }

            console.log('---------------------')
            console.log('Title: ' + data.Title);
            console.log('---------------------')
            console.log('Released: ' + data.Released);
            for (let j = 0; j < Ratings.length; j++) {
                console.log(Ratings[j]);
            }
            console.log('Country: ' + data.Country);
            console.log('Language: ' + data.Language);
            console.log('---------------------');
            console.log('        Plot         ');/* 56 characters */
            console.log('---------------------------------------------------------');
            console.log(data.Plot);
            console.log('---------------------------------------------------------');
            console.log('Actors: ' + data.Actors + '\n');
        });
}

function callSpotify(trackName) {

    if(trackName === undefined){
        trackName = 'the sign ace';
    }

    var spotify = new Spotify(keys.spotify)

    spotify.search({ type: 'track', query: trackName, limit: 5 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        let trackArr = data.tracks.items;

        console.log(trackArr[0]);

        for (let i = 0; i < trackArr.length; i++) {

            for (let j = 0; j < trackArr[i].artists.length; j++) {
                console.log('----------------' + i + '------------------')
                console.log('Artist: ' + trackArr[i].artists[j].name);
                console.log('Track: ' + trackArr[i].name);
                console.log('Album: ' + trackArr[i].album.name);
                console.log('Preview: ' + trackArr[i].preview_url);
                console.log('-------------------------------------')
            }
        }

        console.log('results returned: '+trackArr.length);

    })

}
