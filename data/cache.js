class MovieCache {
    constructor() {
        this.cache = {}
    }

    getCityCache(cityName) {
        return this.cache[cityName].data
    }

    updateCache( cityName, data ) {
        this.cache[cityName] = { data: data, timestamp: Date.now() };
        console.log(this.cache)
        console.log('Cache updated for: ' + cityName)
    }

    // check to make sure cached data is under 24 hours old
    isTimestampValid(cityTimestamp) {
        return Date.now() - cityTimestamp < 86400 ? true : false
    }

    // check to see if there is a cached obj for the given city, and if its fresh.
    // if so, return true otherwise return false 
    isInCache(cityName) {
        if ( this.cache[cityName] ) {
            if ( this.isTimestampValid( this.cache[cityName].timestamp )) {
                console.log('cache hit: ' + cityName)
                return true
            } else {
                delete this.cache[cityName]
                console.log('removed old cache for: ' + cityName)
                return false
            }
        } else {
            console.log('cache miss')
            return false
        }
    }
}

module.exports = MovieCache;