const axios = require('axios')
const MovieCache = require('../data/cache')
const cache = new MovieCache();

async function getMovies(req, res, next) {
    const { searchQuery } = req.query

    //check the cache to see if movie data is there for the city, if not, fetch using axios
    if ( cache.isInCache( searchQuery )) {
        res.status(200).send( cache.getCityCache( searchQuery ))
    } else {
        const movieUrl = `${process.env.MOVIE_API_URL}` +
                        `?include_adult=false&language=en-US&page=1` +
                        `&query=${searchQuery}`
        const config = {
            headers:{
                Authorization: `Bearer ${process.env.MOVIE_API_KEY}`
            }
        };

        const movieResults = await axios.get(movieUrl, config).catch(err => { next(err) });
        const movieData = movieResults.data.results.map( movie => {
            return new Movie({ 'title': movie.title, 'popularity': movie.popularity })
        })
        .sort((a,b) => {
            if (a.popularity > b.popularity) {
                return -1
            }
            if (a.popularity < b.popularity) {
                return 1
            }
            return 0
        })
        cache.updateCache( searchQuery, movieData )
        res.status( 200 ).send( movieData )        
    }
}

class Movie {
    constructor(obj) {
        this.title = obj.title
        this.popularity = obj.popularity
    }
}

module.exports = getMovies