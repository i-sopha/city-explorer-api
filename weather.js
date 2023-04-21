'use strict';

const axios = require('axios');
const cache = require('./cache.js');

async function getWeather(req, res) {
  const lat = req.query.lat;
  const lon = req.query.lon;
  const searchQuery = req.query.searchQuery;
  const key = 'weather-' + searchQuery;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.REACT_APP_WEATHER_API_KEY}&city=${searchQuery}&lat=${lat}&lon=${lon}`;

  try {

    if(!cache[key]) {
      cache[key] = {};
      cache[key].timestamp = Date.now();
      axios.get(url)
        .then(data => {

          class Forecast {
            constructor(datetime, low_temp, high_temp, description) {
              this.date = datetime;
              this.lowtemp = low_temp;
              this.hightemp = high_temp;
              this.description = description;
            }
          }

          let weather = data;
          let forecastArray = weather.data.data.map( (value, idx) => {
            return new Forecast(`${value.datetime}`, `Today's low is ${value.low_temp}`, `with a high of ${value.high_temp}`, `and ${value.weather.description}`)
          });

          cache[key].data = forecastArray;
          console.log(cache[key].data);
          res.send(forecastArray);
        });
    }
    else {
      res.send(cache[key].data);}
  } catch(error) {
    res.status(500).send('Error: Please check your entry and try again', error);
  }
}

module.exports = getWeather;
