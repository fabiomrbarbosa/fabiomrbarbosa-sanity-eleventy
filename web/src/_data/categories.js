const groq = require('groq')
const client = require('../_utils/sanityClient')
const imageUrl = require("../_utils/imageUrl");

module.exports = async function() {
  function generateCategory(category) {
    const posts = category.posts.map(
      post => ({
        ...post,
      })
    )

    return {
      ...category,
      posts,
    }
  }

  async function getCategories() {
    const docs = await client.fetch(groq`
      *[_type == "category"]{
        ...,
        "posts": *[_type == "post" && references(^._id)]{
          title,
          slug,
          publishedAt,
          mainImage {
            ...,
            asset->
          },
          category->
        }
      }`
    ).catch((err) => console.error(err))
    const prepareCategories = docs.map(generateCategory);
    return prepareCategories;
  }

  return await getCategories();
};
