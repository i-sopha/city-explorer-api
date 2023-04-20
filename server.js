'use strict';

// **** REQUIRE *** (like import but for the backend)

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');

//removing weatherData because were are going to import from API
// let weatherData = require('./data/weather.json');

// *** app === server - Need to call Express to create the server
const app = express();

// *** MIDDLEWARE *** allow anyone to hit our server
app.use(cors());

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`Yay we are up on port ${PORT}`));

// **** ENDPOINTS ****
// *** 1st arg - endpoint url as a string
// *** 2nd arg - callback which will execute when that endpoint is hit
//              ** 2 parameters, request, response

app.get('/search', (request, response) => {
  response.status(200).send('Welcome to my server!');
});









// *** WEATHER ***
app.get('/weather', async (request, response, next) => {

  try {
    let lat = request.query.lat;
    let lon = request.query.lon;
    // let searchQuery = request.query.searchQuery;

    let weatherUrl = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.REACT_APP_WEATHER_API_KEY}&lat=${lat}&lon=${lon}`;

    let weatherData = await axios.get(weatherUrl);

    let dataToSend = weatherData.data.data.map(day => new Forecast(day));

    response.status(200).send(dataToSend);

  } catch (error) {
    console.log(error.message);
    next(error.message);
  }

});

class Forecast {
  constructor(weatherObj) {
    this.date = weatherObj.datetime;
    this.description = weatherObj.weather.description;
    this.low = weatherObj.low_temp;
    this.high = weatherObj.high_temp;
    this.temp = weatherObj.temp;
  }
}






// *** MOVIES ***
app.get('/movies', async (request, response, next) => {
  try {
    // Accept or define my queries -> /photos?city=VALUE
    let movies = request.query.city;

    // Build out my url to pass to axios -> require axios at the top // npm install axios
    let moviesUrl = `https://api.themoviedb.org/3/movie?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&query=${movies}`;

    // Store my axios data in a variable
    let moviesData = await axios.get(moviesUrl);

    // Take that result from axios and groom it with my class
    // NOTE: moviesData.data.results.map -> obj -> to my class
    let dataToSend = moviesData.data.results.map(obj => new Movies(obj));

    // Groom data and send it in the response
    response.status(200).send(dataToSend);
  } catch (error) {
    next(error);
  }
});

// TODO: DEFINE MY MOVIES CLASS and info I want to send to the front end
class Movies {
  constructor(movObj){
    this.id = movObj.id;
    this.title = movObj.title;
    this.overview = movObj.overview;
    this.imgUrl = movObj.poster_path;
    this.popularity = movObj.popularity;
    this.releaseDate = movObj.release_date;
  }
}








// *** CATCH ALL ENDPOINT SHOULD BE THE LAST DEFINED ***
app.get('*', (request, response) => {
  response.status(404).send('This page does not exist');
});


// **** ERROR HANDLING - PLUG AND PLAY CODE FROM EXPRESS DOCS ****
app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send('Something went wrong');
});
