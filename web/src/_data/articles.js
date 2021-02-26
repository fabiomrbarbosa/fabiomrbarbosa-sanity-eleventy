const BlocksToMarkdown = require("@sanity/block-content-to-markdown");
const groq = require("groq");
const client = require("../_utils/sanityClient.js");
const serializers = require("../_utils/serializers");

module.exports = async function () {
  function generateArticle(article) {
    return {
      ...article,
      body: BlocksToMarkdown(article.body, { serializers, ...client.config() }),
    };
  }

  async function getArticles() {
    const filter = groq`*[_type == "article" && defined(slug) && publishedAt < now()]`;
    const projection = groq`{
      ...,
      author->{
        name,
        slug,
        image {
          ...,
          asset->,
        }
      },
      category->{
        title,
        slug
      },
      mainImage {
        ...,
        asset->
      },
      body[]{
        ...,
        children[]{
          ...,
        },
        _type == "image" => {
          ...,
          asset->
        }
      }
    }`;
    const order = `| order(publishedAt desc)`;
    const query = [filter, projection, order].join(" ");
    const docs = await client.fetch(query).catch((err) => console.error(err));
    const prepareArticles = docs.map(generateArticle);
    return prepareArticles;
  }

  return await getArticles();
};
