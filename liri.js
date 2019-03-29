const dotenv = require("dotenv").config();
const keys = require("./key.js");
const Spotify = require('node-spotify-api');
const axios = require("axios");

if (dotenv.error){
    throw dotenv.error
}

const command = process.argv[2];
const commandString = process.argv[3];

if(command === 'movie-this'){

    callOMBD(commandString);
}
else if(command === 'spotify-this-song'){

    callSpotify(commandString);
}
else{
    console.log('invalid command');
    console.log('valid commands: ');
    console.log("movie-this '<movie title here>' ");
    console.log("spotify-this-song '<song name here>' ");
    console.log("concert-this '<artist/band name here>' ");
    console.log('');
}

function callOMBD(movieName){

    const omdb_id = dotenv.parsed.OMDB_ID;

    axios.get("http://www.omdbapi.com/?t="+movieName+"&y=&plot=short&apikey="+omdb_id)
        .then(function(response) {

            let data = response.data;

            /* console.log(JSON.stringify(data)); */

            console.log('---------------------')
            console.log('Title: '+data.Title);
            console.log('---------------------')
            console.log('Released: '+data.Released);
            console.log('IMDB Rating: '+data.Ratings[0].Value);
            console.log('Rotten Tomatoes Rating: '+data.Ratings[1].Value);
            console.log('Country: '+data.Country);
            console.log('Language: '+data.Language);
            console.log('---------------------');
            console.log('        Plot         ');/* 56 characters */
            console.log('---------------------------------------------------------');
            console.log(data.Plot);
            console.log('---------------------------------------------------------');
            console.log('Actors: '+data.Actors);
    });
}

function callSpotify(trackName){

    var spotify = new Spotify(keys.spotify)

    spotify.search({type: 'track', query: trackName},function(err,data){
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(data.tracks.items[0]);
    })
    
}
