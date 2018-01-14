const airports = require('./data/airports')
const request = require('request')
const turf = require('@turf/helpers')
const gc = require('@turf/great-circle')

module.exports = function (options) {
  const { token, width = 512, height = 512 } = options

  return function (req, res, next) {
    var fromAirport = airports[req.params.from]
    var toAirport = airports[req.params.to]

    var from = turf.point([fromAirport.long, fromAirport.lat])
    var to = turf.point([toAirport.long, toAirport.lat])
    var greatCircle = gc(from, to, {npoints: 40})

    greatCircle.properties.stroke = '#FF0000'

    var mapBoxUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/pin-s-airport+002850(${fromAirport.long},${fromAirport.lat}),pin-s-airport+002850(${toAirport.long},${toAirport.lat}),geojson(${encodeURIComponent(JSON.stringify(greatCircle))}/auto/${width}x${height}?access_token=${token}`

    request
      .get(mapBoxUrl)
      .pipe(res)
      .on('finish', () => {
        next()
      })
  }
}
