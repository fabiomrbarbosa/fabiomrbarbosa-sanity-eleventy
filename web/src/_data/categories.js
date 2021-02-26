const groq = require('groq')
const client = require('../_utils/sanityClient')

module.exports = async function() {
  function generateCategory(category) {
    const articles = category.articles.map(
      article => ({
        ...article,
      })
    )

    return {
      ...category,
      articles,
    }
  }

  async function getCategories() {
    const docs = await client.fetch(groq`
      *[_type == "category"]{
        ...,
        "articles": *[_type == "article" && references(^._id)]{
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
