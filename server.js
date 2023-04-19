'use strict';

// **** REQUIRE *** (like import but for the backend)

const express = require('express');
require('dotenv').config();
const cors = require('cors');
let weatherData = require('./data/weather.json');

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

app.get('/', (request, response) => {
  response.status(200).send('Welcome to my server!');
});

app.get('/hello', (request, response)=>{
  let firstName = request.query.userFirstName;
  let lastName = request.query.userLastName;

  console.log(request.query);

  response.status(200).send(`Hello ${firstName} ${lastName}, welcome to my server!`);

});


// *** HELPFUL START FOR YOUR LAB ***
app.get('/weather', (request,response,next)=>{
  try{
  try {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let searchQuery = request.query.searchQuery;

    let weather = weatherData.find(city => city.city_name === searchQuery)

    let result = weather.data.map(day => new Forecast(day))

    response.status(200).send(result)


 response.status(200).send(dataToSend.myWeatherData);
  }catch(error){
     next(error);
  }
 

})

class Weather{
 constructor(weatherObj){
     this.cityName = weatherObj.city_name,
     this.lattitude = weatherObj.lon,
     this.longitude = weatherObj.lat,
     this.data = weatherObj.data
 }
    myWeatherData = [];

 generateWeatherData(){
     this.myWeatherData = this.data.reduce((allweather,dayweather)=>{

         allweather.push({'date':dayweather.datetime},{'hightemp': dayweather.high_temp}, {'lowtemp': dayweather.low_temp});
         return allweather;
     },[]);
 }
}


// *** CATCH ALL ENDPOINT SHOULD BE THE LAST DEFINED ***
app.get('*', (request, response) => {
  response.status(404).send('This page does not exist');
});


// **** ERROR HANDLING - PLUG AND PLAY CODE FROM EXPRESS DOCS ****
app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});
