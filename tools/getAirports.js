const axios = require('axios')
const csv = require('csvtojson')
const fs = require('fs')
const _ = require('lodash')

axios.get('https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat').then(function (response) {
  var airports = []

  csv({
    noheader: true,
    headers: ['id', 'name', 'city', 'country', 'IATA', 'ICAO', 'lat', 'long', 'altitude', 'timezone', 'DST', 'tz', 'type', 'source']
  })
    .fromString(response.data)
    .on('json', jsonObj => {
      airports.push(jsonObj)
    })
    .on('done', () => {
      // Keep only those airports with an IATA code
      _.remove(airports, (airport) => {
        return airport.IATA === '\\N'
      })

      // Keep only the fields that interest us here
      airports = _.map(airports, (airport) => {
        return _.pick(airport, ['name', 'city', 'country', 'IATA', 'lat', 'long'])
      })

      // Key by IATA code
      airports = _.keyBy(airports, 'IATA')

      // Write out the file
      fs.writeFileSync('./data/airports.json', JSON.stringify(airports, null, 2), 'utf8')
    })
})
