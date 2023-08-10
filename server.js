'use strict'
require('dotenv').config()
require('./data/cache')
const express = require('express')
const cors = require('cors')
const getMovies = require('./routes/movies')
const getWeather = require('./routes/weather')
const app = express()
app.use(cors())

const PORT = process.env.PORT || 3001

app.get('/', (req, res, next) => {
    res.status(200).send('Default Route')
});

app.get('/movies', getMovies);

app.get('/weather', getWeather);

app.use(( error, req, res, next ) => {
    res.status(500).send(error.message);
})

app.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`)
})