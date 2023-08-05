'use strict'
const express = require('express')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()
const app = express()
app.use(cors())

const PORT = process.env.PORT || 3001

app.get('/', (req, res, next) => {
    res.status(200).send('default route working')
});

app.get('/movies', async (req, res, next) => {
    try {
        const { searchQuery } = req.query
        const movieUrl = `${process.env.MOVIE_API_URL}` +
                         `?include_adult=false&language=en-US&page=1` +
                         `&query=${searchQuery}`
        const config = {
            headers:{
                Authorization: `Bearer ${process.env.MOVIE_API_KEY}`
            }
        };
        const movieResults = await axios.get(movieUrl, config);
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
    }catch (err){
        next(err)
    }
})

class Movie {
    constructor(obj) {
        this.title = obj.title
        this.popularity = obj.popularity
    }
}

app.get('/weather', async (req, res, next) => {
    try {
        const { lat, lon, searchQuery } = req.query
        const weatherUrl = `${process.env.WEATHER_API_URL}` + 
                           `?key=${process.env.WEATHER_API_KEY}` +
                           `&units=I` +
                           `&lat=${lat}&lon=${lon}`
        const weatherData = await axios.get(weatherUrl)
        const cityForecastData = weatherData.data.data.map((day) => {
            return new Forecast({ date: day.valid_date, description: day.weather.description })
        })
        res.status( 200 ).send( cityForecastData )
    } catch( error ) {
        next( error )
    }
});

class Forecast {
    constructor(obj) {
        this.date = obj.date
        this.desc = obj.description
    }
}

app.use(( error, req, res, next ) => {
    res.status(500).send(error.message);
})

app.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`)
})