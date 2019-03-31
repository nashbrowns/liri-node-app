const dotenv = require("dotenv").config();
const keys = require("./key.js");
const Spotify = require('node-spotify-api');
const moment = require('moment');
const axios = require("axios");
var fs = require("fs");

if (dotenv.error) {
    throw dotenv.error
}

const command = process.argv[2];
let commandString = process.argv.slice(3).join(" ");

console.log(commandString);

function callLiri(command, commandString){
    if (command === 'movie-this') {

        if(commandString === ''){
            commandString = 'Mr. Nobody';
        }
    
        callOMBD(commandString);
    }
    else if (command === 'spotify-this-song') {
    
        if(commandString === ''){
            commandString = 'ace of base the sign';
        }    
    
        callSpotify(commandString);
    }
    else if (command === 'concert-this'){
    
        callBands(commandString);
    
    }
    else if (command === 'do-what-it-says'){
        callRandom();
    }
    else {
        console.log('invalid command');
        console.log('valid commands: ');
        console.log("movie-this '<movie title here>' ");
        console.log("spotify-this-song '<song name here>' ");
        console.log("concert-this '<artist/band name here>' ");
        console.log('');
    }
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

    var spotify = new Spotify(keys.spotify)

    spotify.search({ type: 'track', query: trackName, limit: 5 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        let trackArr = data.tracks.items;

        // console.log(trackArr[0]);

        for (let i = 0; i < trackArr.length; i++) {

            for (let j = 0; j < trackArr[i].artists.length; j++) {
                console.log('----------------' + (i+1) + '------------------')
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

function callBands(bandName){

    const bands_id = dotenv.parsed.BANDS_ID;

    bandName = bandName.replace(' ','%20');

    axios.get("https://rest.bandsintown.com/artists/" + bandName + "/events?app_id="+bands_id+"&date=upcoming")
        .then(function (response) {

            for(let i = 0; i<4;i++){
                console.log('\n-----------------------');
                console.log(response.data[i].venue.name);
                if(response.data[i].venue.region === ''){
                    console.log(response.data[i].venue.city);
                }
                else{
                    console.log(response.data[i].venue.city+','+response.data[i].venue.region);

                }
                let showDate = moment(response.data[i].datetime).format('MM/DD/YYYY');
                console.log('Date: '+showDate);
                console.log('-----------------------');
            }
            
        });
}

function callRandom(){

    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
      
        // We will then print the contents of data
        console.log(data);
      
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",").map(item => item.trim()); //map iterates through each item of array. It leaves original array alone and makes new one.
      
        // We will then re-display the content as an array for later use.
        // console.log(dataArr);

        let command = dataArr[0];
        let commandString = dataArr[1];

        callLiri(command, commandString);
      
      });
}

callLiri(command, commandString);
