const axios = require('axios')

async function getWeather(req, res, next) {
    const { lat, lon, searchQuery } = req.query
    const weatherUrl = `${process.env.WEATHER_API_URL}` + 
                        `?key=${process.env.WEATHER_API_KEY}` +
                        `&units=I` +
                        `&lat=${lat}&lon=${lon}`
    const weatherData = await axios.get(weatherUrl).catch(err => { next(err) })
    const cityForecastData = weatherData.data.data.map((day) => {
        return new Forecast({ date: day.valid_date, description: day.weather.description })
    })
    res.status( 200 ).send( cityForecastData )
};

class Forecast {
    constructor(obj) {
        this.date = obj.date
        this.desc = obj.description
    }
}

module.exports = getWeather