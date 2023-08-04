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

app.get('/weather', async (req, res, next) => {
    try {
        const lat = req.query.lat
        const lon = req.query.lon
        const searchQuery = req.query.searchQuery;
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