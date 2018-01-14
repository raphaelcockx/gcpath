const airports = require('./data/airports')
const request = require('request')
const turf = require('@turf/helpers')
const gc = require('@turf/great-circle')

module.exports = function (options) {
  var {
    token,
    width = 512,
    height = 512,
    fromIcon = 'airport',
    fromColour = '#002850',
    toIcon = 'airport',
    toColour = '#002850',
    pathColour = '#ff0006'
  } = options

  // Strip the hash sign from icon colours
  fromColour = fromColour.substr(1)
  toColour = toColour.substr(1)

  return function (req, res, next) {
    // Check whether a token was provided
    if (token === undefined) {
      res.status(401).send('Please provide your Mapbox token in the options object')
      return undefined
    }

    var fromAirport = airports[req.params.from]
    var toAirport = airports[req.params.to]

    var from = turf.point([fromAirport.long, fromAirport.lat])
    var to = turf.point([toAirport.long, toAirport.lat])
    var greatCircle = gc(from, to, { npoints: 40 })

    greatCircle.properties.stroke = pathColour

    var mapBoxUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/geojson(${encodeURIComponent(JSON.stringify(greatCircle))}),pin-s-${fromIcon}+${fromColour}(${fromAirport.long},${fromAirport.lat}),pin-s-${toIcon}+${toColour}(${toAirport.long},${toAirport.lat})/auto/${width}x${height}?access_token=${token}`

    request
      .get(mapBoxUrl)
      .pipe(res)
      .on('finish', () => {
        next()
      })
  }
}
