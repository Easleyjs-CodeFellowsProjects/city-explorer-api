'use strict'
const express = require('express')
const app = express()
const port = 3000
require('dotenv').config()
const cors = require('cors')
app.use(cors())
const weatherData = require('./data/weather.json')

const PORT = process.env.PORT || 3002

app.get('/', (req, res, next) => {
    res.status(200).send('default route working')
});

app.get('/weather', (req, res, next) => {
    try {
        const lat = req.query.lat
        const lon = req.query.lon
        const searchQuery = req.query.searchQuery;
        //const type = req.query.type;
        //console.log(searchQuery)
        const cityResultData = weatherData.find(( city ) => city.city_name === searchQuery || ( city.lon === lon && city.lat === lat )).data
        const forecastData = cityResultData.map(day => {
            return new Forecast({ date: day.datetime, description: day.weather.description })
        })
        res.status( 200 ).send( forecastData )
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