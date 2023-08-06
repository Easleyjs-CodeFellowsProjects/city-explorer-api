const axios = require('axios')

async function getMovies(req, res, next) {
    const { searchQuery } = req.query
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
    res.status( 200 ).send( movieData )        
}

class Movie {
    constructor(obj) {
        this.title = obj.title
        this.popularity = obj.popularity
    }
}

module.exports = getMovies