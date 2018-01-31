# gcpath

Gcpath is a [Connect](http://www.senchalabs.org/connect/)/[Express](http://expressjs.com/) middleware package that allows you to easily plot the flightpath between two airports on a static map in PNG-format.

It links up to simple formatted URLs with two IATA airport codes such as `/map/BRU/YYZ` and calls the [Mapbox static API](https://www.mapbox.com/api-documentation/#static) to produce a map with markers on both sides and the [great circle path](https://en.wikipedia.org/wiki/Great-circle_distance) between the two.

## How to use

Gcpath can be used anywhere in your path structure but expects to receive two parameters named `:from` and `:to` that will contain upper case IATA codes when requested:

```js

const express = require('express')
const app = express()

const gcpath = require('gcpath')

app.use('/map/:from/:to', gcpath({
  token: '{Your Mapbox API token}'
}))

app.listen(3000, function() {
    console.log('Listening on port 3000')
})

```
In this configuration, a call to `/map/BRU/YYZ` will return a **512 by 512 pixel** image of the shortest flightpath between Brussels Airport and Toronto Pearson airport. See below for details on how to change the size or the colour of images.

## Options

The gcpath function takes an object of options as the first and only parameter. Only one of these is required:

* `token`: Your personal Mapbox API-token. [Check here](https://www.mapbox.com/help/how-access-tokens-work/) to obtain one. (required)
* `width`: Width of the image in pixels (default: 512)
* `height`: Height of the image in pixels (default: 512)
* `style`: The [Mapbox style](https://www.mapbox.com/api-documentation/#styles) to use for the base layer of the map (default: 'streets-v10')
* `fromIcon`: Name of the [Mapbox Maxi icon](https://www.mapbox.com/maki-icons/) to use at the origin airport (default: 'airport')
* `fromColour`: Background colour (in hex format) of the icon to use at the origin aiport (default: '#002850')
* `toIcon`: Name of the Mapbox Maxi icon to use at the destination airport (default: 'airport')
* `toColour`: Background colour (in hex format) of the icon to use at the destination aiport (default: '#002850')
* `pathColour`: Stroke colour (in hex format) to use for the path between both airports (default: '#ff0006)

## Limitations

- Every image produced counts towards the [API limits](https://www.mapbox.com/api-documentation/#rate-limits) imposed by Mapbox. Information about rate limits will be available in some of the special headers included by Mapbox in the response. Please note that Mapbox works with map tiles of 512 by 512 pixels. Any image smaller than that will use exactly 1 tile request, slighty larger images will use 4.
- In accordance with Mapbox Terms&Conditions, gcpath will not cache any images.

# License

MIT (c) 2018 Raphael Cockx ([@raphaelcockx](https://twitter.com/raphaelcockx))
