const groq = require('groq')
const client = require('../_utils/sanityClient')
module.exports =  async function() {
  return await client.fetch(groq`
    *[_id == "siteSettings"]{
      ...,
      author->
    }[0]
  `)
}
