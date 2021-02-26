const client = require('./sanityClient')
const imageUrlBuilder = require('@sanity/image-url')

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(client)

// Then we like to make a simple function like this that gives the
// builder an image and returns the builder for you to specify additional
// parameters:
function imageUrl(source) {
  return builder.image(source)
}

module.exports = imageUrl
