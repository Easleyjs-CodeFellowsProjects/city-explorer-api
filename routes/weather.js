const axios = require('axios')
const WeatherCache = require('../data/cache')
const cache = new WeatherCache();

async function getWeather(req, res, next) {
    const { lat, lon, searchQuery } = req.query
    //check the cache to see if movie data is there for the city, if not, fetch using axios
    if ( cache.isInCache( searchQuery )) {
        console.log('Cache hit.')
        res.status(200).send( cache.getCityCache( searchQuery ))
    } else {
        const weatherUrl = `${process.env.WEATHER_API_URL}` + 
                            `?key=${process.env.WEATHER_API_KEY}` +
                            `&units=I` +
                            `&lat=${lat}&lon=${lon}`
        const weatherData = await axios.get(weatherUrl).catch(err => { next(err) })
        const cityForecastData = weatherData.data.data.map((day) => {
            return new Forecast({ date: day.valid_date, description: day.weather.description })
        })
        cache.updateCache( searchQuery, cityForecastData )
        console.log('Cache miss. Updated cache.')
        res.status( 200 ).send( cityForecastData )
    }
};

class Forecast {
    constructor(obj) {
        this.date = obj.date
        this.desc = obj.description
    }
}

module.exports = getWeather