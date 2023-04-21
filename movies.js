'use strict';

const axios = require('axios');
const cache = require('./cache.js');

async function getMovies(req, res) {
  const searchQuery = req.query.searchQuery;
  const key = 'movies-' + searchQuery;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&query=${searchQuery}&page=1`;

  try {

    if (!cache[key]) {
      cache[key] = {};
      cache[key].timestamp = Date.now();
      axios.get(url)
        .then(data => {
          const topMovies = data.data.results;
          const top20Movies = topMovies.sort((a, b) => b.popularity - a.popularity);
          const newMoviesArray = [];

          class Movie {
            constructor(title, overview, vote_average, vote_count, poster_path, popularity, release_date) {
              this.tableName = 'movies',
              this.title = title,
              this.overview = overview,
              this.avgVotes = vote_average,
              this.totalVotes = vote_count,
              this.image_url = poster_path,
              this.popularity = popularity,
              this.releasedOn = release_date,
              this.timestamp = Date.now();
            }
          }
          for (let i = 0; i < 20; i++) {
            newMoviesArray.push(new Movie(top20Movies[i].title, top20Movies[i].overview, top20Movies[i].vote_average, top20Movies[i].vote_count, top20Movies[i].poster_path, top20Movies[i].popularity, top20Movies[i].release_date));
          }
          cache[key].data = newMoviesArray;
          console.log(cache[key].data);
          res.send(newMoviesArray);
        });
    } else {
      res.send(cache[key].data);
    }
  } catch (error) {
    res.status(500).send('Error: Please check your entry and try again', error);
  }
}
module.exports = getMovies;
